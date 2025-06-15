import { baseService } from './baseService';

export type User = {
  id: number;
  name: string;
  email: string;
}

export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
}

// 修改baseUrl的範例
baseService.get<Post[]>('/posts', {
  baseUrl: 'https://jsonplaceholder.typicode.com/test',
}).then(([error, result]) => {
  if(error) {
    console.error(error);
  } else {
    console.log(result);
  }
})
