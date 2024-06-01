import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditQuestionUseCase } from './edit-question';
import { NotAllowedError } from './errors/not-allowed-error';

// Arrange (Preparar o teste), Act (Rodar o teste) e Assert (Verificar as asserções)

// preparar o teste
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should edit a question using the id', async () => {
    // arange
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    // act
    const result = await sut.execute({
      questionId: '123',
      authorId: 'author-1',
      content: 'new content',
      title: 'new title',
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(1);
    expect(result.isRight()).toBe(true);
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: '123',
      authorId: 'author-2',
      content: 'new content',
      title: 'new title',
    });

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
