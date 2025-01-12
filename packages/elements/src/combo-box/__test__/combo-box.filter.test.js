import { fixture, expect, elementUpdated, oneEvent, nextFrame } from '@refinitiv-ui/test-helpers';
import { getData, snapshotIgnore } from './utils';

import '@refinitiv-ui/elements/combo-box';
import '@refinitiv-ui/elemental-theme/light/ef-combo-box';

const setInputEl = async (el, textInput) => {
  setTimeout(() => {
    el.inputEl.value = textInput;
    el.inputEl.dispatchEvent(new CustomEvent('value-changed', { detail: { value: textInput } }));
  });
  await oneEvent(el, 'query-changed');
  await elementUpdated(el);
};

describe('combo-box/Filter', () => {
  describe('Can Filter Data', () => {
    it('Default filter filters data', async () => {
      const el = await fixture('<ef-combo-box opened></ef-combo-box>');
      el.data = getData();
      await elementUpdated(el);
      await nextFrame(); // needs for IE11
      let textInput = 'Al';
      await setInputEl(el, textInput);
      expect(el.query).to.equal(textInput, 'Query should be the same as input text: "Al"');
      expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);

      textInput = 'Aland Islands';
      await setInputEl(el, textInput);
      expect(el.query).to.equal(textInput, 'Query should be the same as input text: "Aland Islands"');
      expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
  });
});
