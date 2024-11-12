// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.2
//   protoc               unknown
// source: payment-service/client/payment/payment.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "payment_protobuf";

export interface GetUserWalletReqGrpc {
  userId: number;
}

export interface GetUserWalletResGrpc {
  userId: number;
  balance: number;
}

function createBaseGetUserWalletReqGrpc(): GetUserWalletReqGrpc {
  return { userId: 0 };
}

export const GetUserWalletReqGrpc: MessageFns<GetUserWalletReqGrpc> = {
  encode(message: GetUserWalletReqGrpc, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserWalletReqGrpc {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserWalletReqGrpc();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserWalletReqGrpc {
    return { userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0 };
  },

  toJSON(message: GetUserWalletReqGrpc): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserWalletReqGrpc>, I>>(base?: I): GetUserWalletReqGrpc {
    return GetUserWalletReqGrpc.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserWalletReqGrpc>, I>>(object: I): GetUserWalletReqGrpc {
    const message = createBaseGetUserWalletReqGrpc();
    message.userId = object.userId ?? 0;
    return message;
  },
};

function createBaseGetUserWalletResGrpc(): GetUserWalletResGrpc {
  return { userId: 0, balance: 0 };
}

export const GetUserWalletResGrpc: MessageFns<GetUserWalletResGrpc> = {
  encode(message: GetUserWalletResGrpc, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.balance !== 0) {
      writer.uint32(17).double(message.balance);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserWalletResGrpc {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserWalletResGrpc();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 17) {
            break;
          }

          message.balance = reader.double();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserWalletResGrpc {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      balance: isSet(object.balance) ? globalThis.Number(object.balance) : 0,
    };
  },

  toJSON(message: GetUserWalletResGrpc): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.balance !== 0) {
      obj.balance = message.balance;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserWalletResGrpc>, I>>(base?: I): GetUserWalletResGrpc {
    return GetUserWalletResGrpc.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserWalletResGrpc>, I>>(object: I): GetUserWalletResGrpc {
    const message = createBaseGetUserWalletResGrpc();
    message.userId = object.userId ?? 0;
    message.balance = object.balance ?? 0;
    return message;
  },
};

export type GrpcPaymentService = typeof GrpcPaymentService;
export const GrpcPaymentService = {
  getUserWallet: {
    path: "/payment_protobuf.GrpcPayment/GetUserWallet",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserWalletReqGrpc) => Buffer.from(GetUserWalletReqGrpc.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserWalletReqGrpc.decode(value),
    responseSerialize: (value: GetUserWalletResGrpc) => Buffer.from(GetUserWalletResGrpc.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserWalletResGrpc.decode(value),
  },
} as const;

export interface GrpcPaymentServer extends UntypedServiceImplementation {
  getUserWallet: handleUnaryCall<GetUserWalletReqGrpc, GetUserWalletResGrpc>;
}

export interface GrpcPaymentClient extends Client {
  getUserWallet(
    request: GetUserWalletReqGrpc,
    callback: (error: ServiceError | null, response: GetUserWalletResGrpc) => void,
  ): ClientUnaryCall;
  getUserWallet(
    request: GetUserWalletReqGrpc,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserWalletResGrpc) => void,
  ): ClientUnaryCall;
  getUserWallet(
    request: GetUserWalletReqGrpc,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserWalletResGrpc) => void,
  ): ClientUnaryCall;
}

export const GrpcPaymentClient = makeGenericClientConstructor(
  GrpcPaymentService,
  "payment_protobuf.GrpcPayment",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GrpcPaymentClient;
  service: typeof GrpcPaymentService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}