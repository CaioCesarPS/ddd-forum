import { SlugVO } from './slug'

test('it should be able to create a new slug from text', () => {
  const slug = SlugVO.createFromText('Hello World')

  expect(slug.value).toEqual('hello-world')
})
