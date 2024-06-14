import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public items: Question[] = [];

  async create(question: Question): Promise<void> {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | undefined> {
    const question = this.items.find(
      (question) => question.slug.value === slug,
    );

    if (!question) {
      return undefined;
    }

    return question;
  }

  async delete(question: Question): Promise<void> {
    const itemsWithoutDeleted = this.items.filter(
      (item) => item.id.toString() !== question.id.toString(),
    );

    this.items = itemsWithoutDeleted;

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async findById(id: string): Promise<Question | undefined> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return undefined;
    }

    return question;
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    );

    this.items[index] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
