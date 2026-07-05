import { LlmModel } from '../entities/model.entity';

export class ModelResponseDto {
  apiKeyRef: string;
  baseUrl: string;
  contextWindow: number;
  createdAt: Date;
  createdBy: string;
  defaultParams?: string;
  hasSecretKey: boolean;
  id: string;
  modelCode: string;
  modelName: string;
  modelType: LlmModel['modelType'];
  priceInput: string;
  priceOutput: string;
  status: LlmModel['status'];
  supportFunctionCall: boolean;
  supportStream: boolean;
  updatedAt: Date;
  updatedBy?: string;
  vendor: string;

  constructor(model: LlmModel) {
    this.apiKeyRef = model.apiKeyRef;
    this.baseUrl = model.baseUrl;
    this.contextWindow = model.contextWindow;
    this.createdAt = model.createdAt;
    this.createdBy = model.createdBy;
    this.defaultParams = model.defaultParams;
    this.hasSecretKey = Boolean(model.secretKey);
    this.id = model.id;
    this.modelCode = model.modelCode;
    this.modelName = model.modelName;
    this.modelType = model.modelType;
    this.priceInput = model.priceInput;
    this.priceOutput = model.priceOutput;
    this.status = model.status;
    this.supportFunctionCall = model.supportFunctionCall;
    this.supportStream = model.supportStream;
    this.updatedAt = model.updatedAt;
    this.updatedBy = model.updatedBy;
    this.vendor = model.vendor;
  }
}
