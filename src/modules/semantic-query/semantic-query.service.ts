@Injectable()
export class SemanticQueryService {
  async ask(question: string) {
    return {
      question,
      generatedSql: 'SELECT 1',
      answer: 'Prototype response',
    };
  }
}
