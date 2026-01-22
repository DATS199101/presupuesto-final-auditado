import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';

interface Transaccion {
  id: number;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  categoria: string;
  fecha: string;
  descripcion: string;
}

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.page.html',
  styleUrls: ['./transacciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TransaccionesPage implements OnInit {

  transacciones: Transaccion[] = [];
  balance: number = 0;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.cargarTransacciones();
  }

  cargarTransacciones() {
    const data = localStorage.getItem('transacciones');
    this.transacciones = data ? JSON.parse(data) : [];
    this.calcularBalance();
  }

  guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(this.transacciones));
    this.calcularBalance();
  }

  calcularBalance() {
    this.balance = this.transacciones.reduce((total, t) => {
      return t.tipo === 'ingreso'
        ? total + t.monto
        : total - t.monto;
    }, 0);
  }

  async agregarTransaccion(tipo: 'ingreso' | 'gasto') {
    const alert = await this.alertCtrl.create({
      header: `Nuevo ${tipo}`,
      inputs: [
        { name: 'monto', type: 'number', placeholder: 'Monto' },
        { name: 'categoria', type: 'text', placeholder: 'Categoría' },
        { name: 'fecha', type: 'date' },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const nueva: Transaccion = {
              id: Date.now(),
              tipo,
              monto: Number(data.monto),
              categoria: data.categoria,
              fecha: data.fecha,
              descripcion: data.descripcion
            };
            this.transacciones.push(nueva);
            this.guardarTransacciones();
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarTransaccion(id: number) {
    this.transacciones = this.transacciones.filter(t => t.id !== id);
    this.guardarTransacciones();
  }

  transaccionesPorFecha() {
    const grupos: { [fecha: string]: Transaccion[] } = {};
    this.transacciones.forEach(t => {
      if (!grupos[t.fecha]) {
        grupos[t.fecha] = [];
      }
      grupos[t.fecha].push(t);
    });
    return grupos;
  }


async editarTransaccion(t: Transaccion) {
  const alert = await this.alertCtrl.create({
    header: `Editar ${t.tipo}`,
    inputs: [
      { name: 'monto', type: 'number', value: t.monto, placeholder: 'Monto' },
      { name: 'categoria', type: 'text', value: t.categoria, placeholder: 'Categoría' },
      { name: 'fecha', type: 'date', value: t.fecha },
      { name: 'descripcion', type: 'text', value: t.descripcion, placeholder: 'Descripción' }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: (data) => {
          t.monto = Number(data.monto);
          t.categoria = data.categoria;
          t.fecha = data.fecha;
          t.descripcion = data.descripcion;
          this.guardarTransacciones();
        }
      }
    ]
  });

  await alert.present();
}


}
