import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditQuestionUseCase } from './edit-question';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachments';

// Arrange (Preparar o teste), Act (Rodar o teste) e Assert (Verificar as asserções)

// preparar o teste
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
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

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    // act
    const result = await sut.execute({
      questionId: '123',
      authorId: 'author-1',
      content: 'new content',
      title: 'new title',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(1);
    expect(result.isRight()).toBe(true);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
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
      attachmentsIds: [],
    });

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
