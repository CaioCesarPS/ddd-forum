import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
  });

  it('should delete a answer using the id', async () => {
    const newQuestion = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryAnswerRepository.create(newQuestion);

    await sut.execute({
      questionId: '123',
      authorId: 'author-1',
    });

    expect(inMemoryAnswerRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('123'),
    );

    inMemoryAnswerRepository.create(newQuestion);

    expect(async () => {
      await sut.execute({
        questionId: '123',
        authorId: 'author-2',
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
