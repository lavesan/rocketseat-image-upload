import { createContext } from 'react';

interface IImagesContext {
  refetch: VoidFunction;
}

const ImagesContext = createContext({} as IImagesContext);
