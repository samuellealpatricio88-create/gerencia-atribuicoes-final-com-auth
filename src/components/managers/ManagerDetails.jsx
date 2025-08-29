import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, TrendingUp, Mail } from 'lucide-react';

export function ManagerDetails({ manager }) {
  // Dados mock para demonstração - em produção viriam do backend
  const mockData = {
    affiliates: [
      'jainefernandaschneider@gmail.com',
      'bagestan@gmail.com', 
      'patti_belitzki@hotmail.com',
      'tomazina107@gmail.com',
      'vanenichetti@gmail.com',
      'denner45oliveira@gmail.com',
      'dannygomes2017@outlook.com',
      'lilimelere@gmail.com',
      're.gemea@hotmail.com',
      'mairagiordani@gmail.com',
      'adm.elianemiranda1195@gmail.com',
      'spaderadriane@yahoo.com.br',
      'llucimarasantos54@gmail.com',
      'fabiana_pzp@hotmail.com',
      'annyfranciellyanny@gmail.com',
      'lucilene113@gmail.com',
      'tpsantos2@ucs.br',
      'suelimariabp@gmail.com',
      'luizfis@terra.com.br',
      'luciani13bellini@gmail.com',
      'patylovato@hotmail.com',
      'peruzzo.debora@gmail.com',
      'paula.lhm@gmail.com',
      'merilin91silva@gmail.com',
      'isabellygonz@gmail.com',
      'cristy_picoloto@hotmail.com'
    ],
    products: [
      { name: 'Curso de Marketing Digital', platform: 'Braip', sales: 45 },
      { name: 'E-book de Vendas', platform: 'Keed', sales: 32 },
      { name: 'Mentoria em Grupo', platform: 'Payt', sales: 28 },
      { name: 'Software de Gestão', platform: 'Hest', sales: 19 }
    ],
    totalRevenue: 'R$ 15.750,00',
    conversionRate: '12.5%'
  };

  const totalAffiliates = mockData.affiliates.length;
  const totalProducts = mockData.products.length;
  const totalSales = mockData.products.reduce((sum, product) => sum + product.sales, 0);

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalAffiliates}</p>
                <p className="text-sm text-gray-600">Afiliadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-sm text-gray-600">Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalSales}</p>
                <p className="text-sm text-gray-600">Vendas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{mockData.totalRevenue}</p>
                <p className="text-sm text-gray-600">Receita</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Afiliadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Afiliadas ({totalAffiliates})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {mockData.affiliates.map((email, index) => (
              <Badge key={index} variant="outline" className="justify-start p-2">
                {email}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Produtos ({totalProducts})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.platform}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.sales} vendas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

