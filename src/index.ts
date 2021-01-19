import getStatus from './actions/getState';
import setColor from './actions/setColor';
import setPowerState from './actions/setPowerState';
import search from './actions/search';
import timeout from './util/timeout';

const loop = async () => {
  console.log('finding bulb');
  const bulbs = await search(1500);

  if (bulbs.length === 0) {
    console.log('No bulbs found');
    return;
  }

  const bulb = bulbs[0];

  const status = await getStatus(bulb);
  console.log(status);

  console.log('turn on');
  await setPowerState(bulb, true);

  console.log('set color red');
  await setColor(bulb, {r: 255, g: 0, b: 0});

  await timeout(async () => {
    console.log('set color green');
    await setColor(bulb, {r: 0, g: 255, b: 0});
  }, 1000);

  await timeout(async () => {
    console.log('set color blue');
    await setColor(bulb, {r: 0, g: 0, b: 255});
  }, 1000);

  await timeout(async () => {
    console.log('turn off');
    await setPowerState(bulb, false);
  }, 1000);
};

loop();
