import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export function AttributionUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Por favor, selecione um arquivo para upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // Aqui você adicionaria a lógica para parsear o CSV/Excel
      // Por enquanto, vamos apenas simular o upload
      console.log('Conteúdo do arquivo:', text);
      setMessage(`Arquivo \'${file.name}\' carregado com sucesso!`);
      if (onUpload) {
        onUpload(text); // Passa o conteúdo para o componente pai
      }
      setFile(null); // Limpa o arquivo após o upload
    };
    reader.onerror = () => {
      setMessage('Erro ao ler o arquivo.');
    };
    reader.readAsText(file); // Lê o arquivo como texto
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Atribuições via Planilha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file}>
            <Upload size={20} className="mr-2" />
            Carregar Planilha
          </Button>
        </div>
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <p className="text-sm text-gray-500">
          Por favor, utilize um arquivo CSV ou XLSX com as colunas: Email, Produto, Plataforma, Data, Status.
        </p>
      </CardContent>
    </Card>
  );
}


