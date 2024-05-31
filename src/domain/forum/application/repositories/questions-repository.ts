import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '../../enterprise/entities/question';

export interface QuestionsRepository {
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  findById(id: string): Promise<Question | undefined>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  findBySlug(slug: string): Promise<Question | undefined>;
  save(question: Question): Promise<void>;
}
