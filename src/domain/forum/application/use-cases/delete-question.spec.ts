import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditQuestionUseCase } from './edit-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should edit a question using the id', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'New title',
      content: 'New content',
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    });
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    expect(async () => {
      await sut.execute({
        authorId: 'author-2',
        questionId: newQuestion.id.toString(),
        title: 'New title',
        content: 'New content',
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
