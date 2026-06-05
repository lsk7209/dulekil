"""
dullegilgogo.kr — 배포 후 검색엔진 알림 스크립트

사용법:
  python scripts/notify-search.py           # 사이트맵 제출 + IndexNow 전체 알림
  python scripts/notify-search.py /blog/p17  # 특정 URL만 IndexNow 알림
"""
import sys, io, json, os, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

CLIENT_SECRETS = r'D:\env\adsense_oauth_client.json'
TOKEN_FILE     = r'D:\env\gsc_token.json'
SCOPES         = ['https://www.googleapis.com/auth/webmasters']
SITE_URL       = 'https://dullegilgogo.kr/'
SITEMAP_URL    = 'https://dullegilgogo.kr/sitemap.xml'
INDEXNOW_KEY   = '9c202cd9eeb5468db83592b14dbd4b21'  # public/9c202cd9eeb5468db83592b14dbd4b21.txt

# IndexNow 제출 대상 URL 목록 (주요 페이지)
INDEXNOW_URLS  = [
    'https://dullegilgogo.kr/',
    'https://dullegilgogo.kr/blog',
    'https://dullegilgogo.kr/guide',
    'https://dullegilgogo.kr/mountains',
    'https://dullegilgogo.kr/tracker',
]


def get_gsc_credentials():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request

    with open(TOKEN_FILE, encoding='utf-8') as f:
        token_data = json.load(f)
    with open(CLIENT_SECRETS, encoding='utf-8') as f:
        client_data = json.load(f)['installed']

    token_data.setdefault('client_id', client_data['client_id'])
    token_data.setdefault('client_secret', client_data['client_secret'])
    token_data.setdefault('token_uri', 'https://oauth2.googleapis.com/token')
    token_data.setdefault('universe_domain', 'googleapis.com')
    if 'token' not in token_data and 'access_token' in token_data:
        token_data['token'] = token_data['access_token']

    tmp = TOKEN_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(token_data, f)
    creds = Credentials.from_authorized_user_file(tmp, SCOPES)
    os.remove(tmp)

    if not creds.valid and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        merged = json.loads(creds.to_json())
        merged['access_token'] = merged.get('token', '')
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            json.dump(merged, f, indent=2)
    return creds


def submit_sitemap():
    try:
        from googleapiclient.discovery import build
        creds   = get_gsc_credentials()
        service = build('webmasters', 'v3', credentials=creds)
        service.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f'✓ GSC 사이트맵 제출: {SITEMAP_URL}')
    except Exception as e:
        print(f'✗ GSC 사이트맵 제출 실패: {e}')


def submit_indexnow(urls: list[str]):
    """IndexNow 프로토콜로 Bing에 URL 변경 알림"""
    payload = json.dumps({
        'host': 'dullegilgogo.kr',
        'key': INDEXNOW_KEY,
        'keyLocation': f'https://dullegilgogo.kr/{INDEXNOW_KEY}.txt',  # 파일 존재 확인됨
        'urlList': urls,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.indexnow.org/indexnow',
        data=payload,
        headers={'Content-Type': 'application/json; charset=utf-8'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f'✓ IndexNow 제출 완료 ({len(urls)}개 URL) — HTTP {resp.status}')
    except Exception as e:
        print(f'✗ IndexNow 제출 실패: {e}')


def main():
    urls = INDEXNOW_URLS[:]

    # 추가 URL 인자 처리
    for arg in sys.argv[1:]:
        full = arg if arg.startswith('http') else f'https://dullegilgogo.kr{arg}'
        if full not in urls:
            urls.append(full)

    print('=== 둘레길고고 검색엔진 알림 ===')
    submit_sitemap()
    submit_indexnow(urls)
    print('=== 완료 ===')


if __name__ == '__main__':
    main()
