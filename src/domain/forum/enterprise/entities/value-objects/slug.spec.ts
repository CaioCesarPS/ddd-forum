import { SlugVO } from './slug';

test('it should be able to create a new slug from text', () => {
  const slug = SlugVO.createFromText('Olá, mundo!');

  expect(slug.value).toEqual('ola-mundo');
});
