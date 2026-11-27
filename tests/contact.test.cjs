const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>\s*\/\/ Sends to FormSubmit[\s\S]*?<\/script>/)[0]
  .replace(/^<script>/, '').replace(/<\/script>$/, '');

function setup(response) {
  const status = {}, question = {}, human = { value: '', focus() {} }, check = { hidden: true };
  const button = {};
  const form = { _honey: { value: '' }, querySelector: () => button, reset() {} };
  const elements = { form, formStatus: status, human, hq: question, humanCheck: check };
  const clock = { now: () => 10000 };
  const context = { document: { getElementById: id => elements[id] }, Date: clock,
    Math: { floor: Math.floor, random: () => 0 }, FormData: class {},
    fetch: async () => response };
  vm.runInNewContext(script, context);
  clock.now = () => 14000;
  human.value = '4';
  return { form, status, human, check, button };
}

test('enables the challenge only when the script runs', () => {
  assert.match(html, /id="humanCheck" hidden/);
  assert.doesNotMatch(html.match(/<input id="human"[^>]*>/)[0], /\brequired\b/);
  const { human, check } = setup({});
  assert.equal(human.required, true);
  assert.equal(check.hidden, false);
});

test('reports provider success or failure and re-enables submission', async () => {
  for (const ok of [true, false]) {
    const state = setup({ ok, json: async () => ({ success: ok }) });
    await state.form.onsubmit({ preventDefault() {} });
    assert.match(state.status.textContent, ok ? /message was submitted/ : /email redbarkstudios/);
    assert.equal(state.button.disabled, false);
  }
});
