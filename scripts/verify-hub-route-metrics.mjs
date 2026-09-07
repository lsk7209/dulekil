import assert from 'node:assert/strict';
import { hubDistance, hubDuration, compareHubDistance } from '../lib/hub-route-metrics.ts';
for (const value of [null, undefined, -1, NaN, Infinity]) {
  assert.equal(hubDistance(value), null);
  assert.equal(hubDuration(value), '자료 없음');
}
assert.equal(hubDistance(0.1), 0.1); // A short recorded segment is not automatically corrupt.
assert.equal(hubDistance(0), 0);
assert.equal(hubDistance(3.45), 3.5);
assert.equal(hubDuration(95), '1:35');
assert.equal(hubDuration(59.8), '1:00');
assert.deepEqual([{dist:null},{dist:3},{dist:0.1},{dist:null}].sort(compareHubDistance).map(x=>x.dist), [0.1,3,null,null]);
console.log('HUB_ROUTE_METRICS_OK');
