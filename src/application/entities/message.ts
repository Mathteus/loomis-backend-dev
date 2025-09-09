import { CalculatorSizeService } from '@/common/size-calculator/calculator.service';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

export interface IMessage {
  contentData: string | Blob;
  contentType: MessageType;
  senderId: string;
  receiverId: string;
  timestamp: Date;
}

export class ErrorContentType extends Error {
  constructor() {
    super('Tipo de conteúdo inválido!');
  }
}

export class ErrorContentSize extends Error {
  constructor() {
    super('Conteúdo muito grande!');
  }
}

export class MessageEntity {
  private _message: IMessage;
  private _TextContentLimit = CalculatorSizeService.getKB(1);
  private _ImageContentLimit = CalculatorSizeService.getMB(50);
  private _VideoContentLimit = CalculatorSizeService.getMB(100);
  private _AudioContentLimit = CalculatorSizeService.getMB(50);

  constructor(message: IMessage) {
    this.verifyContentType(message.contentType);
    this.verifyContentSize(message.contentType, message.contentData);
    this._message = message;
  }

  private verifyContentSize(
    messageType: MessageType,
    messageContent: string | Blob,
  ) {
    switch (messageType) {
      case 'TEXT':
        this.verifyContentTextSize(messageContent as string);
        break;
      case 'IMAGE':
        this.verifyContentImageSize(messageContent as Blob);
        break;
      case 'VIDEO':
        this.verifyContentVideoSize(messageContent as Blob);
        break;
      case 'AUDIO':
        this.verifyContentAudioSize(messageContent as Blob);
        break;
      case 'FILE':
        break;
    }
  }

  private verifyContentType(contentType: string) {
    if (
      contentType !== 'TEXT' &&
      contentType !== 'IMAGE' &&
      contentType !== 'VIDEO' &&
      contentType !== 'AUDIO' &&
      contentType !== 'FILE'
    ) {
      throw new ErrorContentType();
    }
  }

  private verifyContentTextSize(contentData: string) {
    if (contentData.length > this._TextContentLimit) {
      throw new ErrorContentSize();
    }
  }

  private verifyContentImageSize(contentData: Blob) {
    if (contentData.size > this._ImageContentLimit) {
      throw new ErrorContentSize();
    }
  }

  private verifyContentVideoSize(contentData: Blob) {
    if (contentData.size > this._VideoContentLimit) {
      throw new ErrorContentSize();
    }
  }

  private verifyContentAudioSize(contentData: Blob) {
    if (contentData.size > this._AudioContentLimit) {
      throw new ErrorContentSize();
    }
  }

  public get contentData(): string | Blob {
    return this._message.contentData;
  }

  public get contentType(): MessageType {
    return this._message.contentType;
  }

  public get senderId(): string {
    return this._message.senderId;
  }

  public get receiverId(): string {
    return this._message.receiverId;
  }

  public get timestamp(): Date {
    return this._message.timestamp;
  }
}
