import React from 'react';

export function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick} >
      {props.value}
    </button>
  );
}
