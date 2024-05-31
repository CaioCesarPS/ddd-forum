import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should find an question by slug', async () => {
    const newQuestion = makeQuestion();

    inMemoryQuestionsRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: newQuestion.slug.value,
    });

    expect(question.slug.value).toEqual(newQuestion.slug.value);
  });
});
