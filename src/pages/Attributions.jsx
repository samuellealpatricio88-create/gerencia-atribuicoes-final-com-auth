import React from 'react';
import { AttributionMatrix } from '../components/attributions/AttributionMatrix';

export function Attributions() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Atribuições</h1>
        <p className="text-gray-600">Gerencie as atribuições de produtos para cada afiliado</p>
      </div>
      
      <AttributionMatrix />
    </div>
  );
}

