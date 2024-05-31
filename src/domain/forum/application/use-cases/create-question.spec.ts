import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      content: 'Question content',
      title: 'Question title',
    });

    expect(question.authorId.toString()).toBeTruthy();
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id);
  });
});
