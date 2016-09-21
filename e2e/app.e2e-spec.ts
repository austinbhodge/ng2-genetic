import { Ng2GeneticPage } from './app.po';

describe('ng2-genetic App', function() {
  let page: Ng2GeneticPage;

  beforeEach(() => {
    page = new Ng2GeneticPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
