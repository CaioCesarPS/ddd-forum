import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Either, left, right } from '@/core/either';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    answer.content = content;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}
