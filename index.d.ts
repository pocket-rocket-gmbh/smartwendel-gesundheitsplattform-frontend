declare module "#app" {
  interface NuxtApp {
    $bus: {
      $on: (event: string, callback: (payload: any) => void) => void;
      $emit: (event: string, ...data: any[]) => void;
    };
  }
}

export {}