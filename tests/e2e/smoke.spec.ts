import { expect, test } from '@playwright/test';

test('cv pdfs are served', async ({ request }) => {
  for (const locale of ['es', 'en']) {
    const res = await request.get(`/cv/miguel-garcia-bilbao-${locale}.pdf`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');
  }
});
