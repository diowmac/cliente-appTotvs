import { Component, OnInit, ViewChild } from '@angular/core';
import { PoTableAction } from '@po-ui/ng-components';
import { ClientesService, Cliente } from '../clientes.service';
import { PoTableModule, PoPageModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoModalModule  } from '@po-ui/ng-components';
import { FormularioComponent } from '../formulario/formulario.component';
import { Router } from '@angular/router';
import { PoModalComponent } from '@po-ui/ng-components';


@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        // Importa FormsModule para ngModel funcionar
    PoTableModule,
    PoPageModule,
    RouterModule,
    PoModalModule,
    FormularioComponent  
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {
  @ViewChild('modalConfirmacao') modalConfirmacao!: PoModalComponent;
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  filtro: string = ''; 
  clienteSelecionado: Cliente | null = null;

  columns = [
  { property: 'id', label: 'Código' },  
  { property: 'nome', label: 'Nome' },
  { property: 'cpf', label: 'CPF' }
];


actions: PoTableAction[] = [
  { label: 'Editar', action: this.editar.bind(this), icon: 'po-icon-edit' },
  { label: 'Excluir', action: this.excluir.bind(this), icon: 'po-icon-delete' }
];


constructor(
  private clientesService: ClientesService,
  private router: Router
) {}

  acaoPrimaria = {
    action: () => this.confirmarExclusao(),
    label: 'Sim',
  };

  acaoSecundaria = {
    action: () => this.cancelarExclusao(),
    label: 'Não',
  };
  
ngOnInit(): void {
    this.clientesService.listar().subscribe(data => {
      this.clientes = data;
      this.clientesFiltrados = data;  // Inicializa a lista filtrada com todos os clientes
    });
  }

editar(cliente: Cliente) {
  this.router.navigate(['/clientes', cliente.id]);
}

 excluir(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.modalConfirmacao.open();
  }

 confirmarExclusao() {
    if (!this.clienteSelecionado) {
      this.modalConfirmacao.close();
      return;
    }

    this.clientesService.excluir(this.clienteSelecionado.id!).subscribe(() => {
      this.clientes = this.clientes.filter(c => c.id !== this.clienteSelecionado?.id);
      this.aplicarFiltro(); // Atualiza a lista filtrada também
      this.modalConfirmacao.close();
      this.clienteSelecionado = null;
    });
  } 

 cancelarExclusao() {
    this.modalConfirmacao.close();
    this.clienteSelecionado = null;
  } 

novo() {
  this.router.navigate(['/clientes/novo']);
}


  aplicarFiltro() {
    const filtroMinusculo = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtroMinusculo)
    );
  }


}
