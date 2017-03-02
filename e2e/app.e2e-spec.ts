import { Ng2RestServicePage } from './app.po';

describe('ng2-rest-service App', function() {
  let page: Ng2RestServicePage;

  beforeEach(() => {
    page = new Ng2RestServicePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
