/**
 * // 初始化默認消息
 * HttpStatusCodeParser.initializeDefaultMessages();
 * 
 * // 動態設定自定義消息
 * HttpStatusCodeParser.setCustomMessage(200, "Custom OK message: Your request was successfully processed.");
 * 
 * // 使用
 * console.log(HttpStatusCodeParser.parseHttpStatusCode(200));  // Output: "Custom OK message: Your request was successfully processed."
 */
export class HttpStatusCodeParser {
  private static statusMessages: { [key: number]: string } = {};

  // 初始化时设置默认的消息
  static initializeDefaultMessages() {
      this.statusMessages = {
          100: "Continue: The server has received the request headers, and the client should proceed to send the request body.",
          200: "OK: The request was successful.",
          400: "Bad Request: The server could not understand the request due to invalid syntax.",
          404: "Not Found: The server cannot find the requested resource.",
          500: "Internal Server Error: The server has encountered a situation it does not know how to handle.",
      };
  }

  // 設定或更新狀態碼對應的訊息
  static setCustomMessage(statusCode: number, message: string): void {
      this.statusMessages[statusCode] = message;
  }

  // 解析狀態碼，返回對應的訊息
  static parseHttpStatusCode(statusCode: number): string {
      const message = this.statusMessages[statusCode];
      if (message) {
          return message;
      } else {
          return `Unknown HTTP status code: ${statusCode}`;
      }
  }
}

export function catchErrorTyped<T, E extends new (message?:string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[null, T] | [InstanceType<E>]> {
  return promise.then(data=> {
    return [null, data] as [null, T]
  }).catch(error => {
    if (errorsToCatch == undefined) {
      return [error]
    }

    if (errorsToCatch.some(e => error instanceof e)) {
      return [error]
    }

    throw error
  })
}