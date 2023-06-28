import React from "react";
import  { createRoot } from 'react-dom/client';
import SnakeGameApp from "./game/snake-game-app";
import './index.css';

const domNode = document.getElementById('root')
const root = createRoot(domNode);

root.render(<SnakeGameApp/>);
