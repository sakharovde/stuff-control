import { createContext } from 'react';
import Core from '../core/core.ts';

const CoreContext = createContext<Core>(new Core());

export default CoreContext;