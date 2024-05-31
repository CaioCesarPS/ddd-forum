export class SlugVO {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): SlugVO {
    return new SlugVO(value);
  }

  static createFromText(text: string): SlugVO {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new SlugVO(slugText);
  }
}
