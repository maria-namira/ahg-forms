import puppetteer from 'puppeteer';

const childProcess = require('child_process');

jest.setTimeout(30000);
describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;

  const baseUrl = 'http://localhost:9000';
  beforeAll(async () => {
    server = await childProcess.fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  describe('Кнопка с тултипом', () => {
    test('Открытие основной страницы', async () => {
      await page.goto(baseUrl);
    });

    test('Должен удалить класс d_none у тултипа при клике', async () => {
      await page.goto(baseUrl);
      const buttonEl = await page.$('.component__button');
      const button = await buttonEl.$('.button');
      button.click();
      await page.waitForFunction(() => document.body.lastElementChild.classList.length < 3);
    });

    test('Должен добавить класс d_none у тултипа при клике', async () => {
      await page.goto(baseUrl);
      const buttonEl = await page.$('.component__button');
      const button = await buttonEl.$('.button');
      button.click();
      await page.waitForFunction(() => document.body.lastElementChild.classList.length > 2);
    });
  });
});
