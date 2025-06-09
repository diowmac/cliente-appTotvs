import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { telefoneMask, cepMask } from '../../Utils/masks';
import { PoNotificationService } from '@po-ui/ng-components';
import {
  PoDynamicModule,
  PoPageModule,
  PoButtonModule,
  PoTableModule
} from '@po-ui/ng-components';

import { ClientesService, Cliente } from '../clientes.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    PoPageModule,
    PoTableModule,
    PoButtonModule,
    PoDynamicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './formulario.component.html'
})
export class FormularioComponent implements OnInit {
  cliente: Cliente = {
    nome: '',
    cpf: '',
    telefones: [] as { numero: string }[],
    enderecos: []
  };

  mensagemErro: string | null = null
  novoTelefone: string = '';
  novoEndereco: any = {};
  novoCep : string = '';
  telefoneMask = telefoneMask;
  cepMask = cepMask;



camposBasicos = [
  {
    property: 'cpf',
    label: 'CPF',
    required: true,
    mask: '999.999.999-99',
    gridColumns: 4,
    placeholder: '000.000.000-00',
  },
  {
    property: 'nome',
    label: 'Nome',
    required: true,
    minLength: 3,
    gridColumns: 8,
    placeholder: 'Digite o nome completo',
  }
];


 camposEndereco = [
 
  {
    property: 'logradouro',
    label: 'Logradouro',
    required: true,
    gridColumns: 6,
  },
  {
    property: 'numero',
    label: 'Número',
    gridColumns: 2,
  },
  {
    property: 'complemento',
    label: 'Complemento',
    gridColumns: 2,
  },
  {
    property: 'bairro',
    label: 'Bairro',
    gridColumns: 4,
  },
  {
    property: 'cidade',
    label: 'Cidade',
    required: true,
    gridColumns: 4,
  },
  {
    property: 'estado',
    label: 'Estado',
    required: true,
    gridColumns: 2,
  },
];

  colunasTelefone = [{ property: 'numero', label: 'Telefone' }];
  colunasEndereco = [
    { property: 'logradouro', label: 'Logradouro' },
    { property: 'numero', label: 'Número' },
    { property: 'complemento', label: 'Complemento' },
    { property: 'bairro', label: 'Bairro' },
    { property: 'cidade', label: 'Cidade' },
    { property: 'estado', label: 'Estado' }
  ];

  acoesTelefone = [
    {
    label: 'Editar',
    action: this.editarTelefone.bind(this),
    icon: 'po-icon-edit'
   },
    {
      label: 'Excluir',
      action: this.removerTelefone.bind(this),
      icon: 'po-icon-delete'
    }
  ];

  acoesEndereco = [
     {
    label: 'Editar',
    action: this.editarEndereco.bind(this),
    icon: 'po-icon-edit'
    },
    {
      label: 'Excluir',
      action: this.removerEndereco.bind(this),
      icon: 'po-icon-delete'
    }
  ];

  constructor(
    private service: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.buscarPorId(+id).subscribe((data) => {
        this.cliente = data;
      });
    }
  }

  adicionarTelefone() {
if (!this.novoTelefone|| this.novoTelefone.trim().length < 9) {
    this.poNotification.error('Telefone inválido.');
    return;
  }

    if (this.novoTelefone.trim()) {
      this.cliente.telefones.push({ numero: this.novoTelefone.trim() });
      this.novoTelefone = '';
    }
  }

  removerTelefone(telefone: { numero: string }) {
    this.cliente.telefones = this.cliente.telefones.filter(
      (t) => t.numero !== telefone.numero
    );
  }

  adicionarEndereco() {
    if (
      this.novoEndereco.logradouro &&
      this.novoEndereco.cidade &&
      this.novoEndereco.estado
    ) {
      this.cliente.enderecos.push({ ...this.novoEndereco });
      this.novoEndereco = {};
    } else {
      alert(
        'Preencha os campos obrigatórios do endereço (logradouro, cidade, estado).'
      );
    }
  }

  removerEndereco(endereco: any) {
    this.cliente.enderecos = this.cliente.enderecos.filter(
      (e) => e !== endereco
    );
  }

salvar() {
  if (!this.cliente.cpf || this.cliente.cpf.trim() === '') {
    this.poNotification.error('O CPF é obrigatório.');
    return;
  }

  if (!this.cliente.nome || this.cliente.nome.trim() === '') {
    this.poNotification.error('O nome é obrigatório.');
    return;
  }

  if (!this.cliente.nome || this.cliente.nome.trim().length < 10) {
    this.poNotification.error('O nome do cliente deve ter no mínimo 10 caracteres.');
    return;
  }

  const idParam = this.route.snapshot.paramMap.get('id');
  const id = idParam ? Number(idParam) : null;

  const operacao = id && !isNaN(id)
    ? this.service.atualizar(id, this.cliente)
    : this.service.salvar(this.cliente);

  operacao.subscribe({
    next: () => this.router.navigate(['/clientes']),
    error: (err) => {
      // Tenta extrair a mensagem interpolada do erro
      let mensagemErro = err.error?.message || 'Ocorreu um erro ao salvar o cliente.';

      // Verifica se a mensagem tem a estrutura específica de validação
      const violacaoRegex = /ConstraintViolationImpl\{interpolatedMessage='([^']+)'/;
      const match = violacaoRegex.exec(err.error?.trace || '');

      if (match && match[1]) {
        mensagemErro = match[1]; // Substitui pela mensagem interpolada
      }

      this.poNotification.error(mensagemErro);
    }
  });
}

  cancelar() {
    this.router.navigate(['/clientes']);
  }

  atualizarCliente(evento: Partial<Cliente>) {
  this.cliente = { ...this.cliente, ...evento };


}

limitarDigitosTelefone(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (allowedKeys.includes(event.key)) {
    return; // Permite teclas de controle
  }

  // Pega valor atual do input (antes da tecla ser adicionada)
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');

  if (digits.length >= 13) {
    event.preventDefault(); // Bloqueia digitação se já atingiu limite
  }
}

// Método para buscar dados do CEP
buscarCep() {
  const cep = this.novoEndereco.cep?.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cep?.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          alert('CEP não encontrado.');
        } else {
          this.novoEndereco.logradouro = data.logradouro || '';
          this.novoEndereco.bairro = data.bairro || '';
          this.novoEndereco.cidade = data.localidade || '';
          this.novoEndereco.estado = data.uf || '';
          this.novoEndereco.complemento = data.complemento || '';
        }
      })
      .catch((error) => {
        alert('Erro ao buscar o CEP.');
        console.error(error);
      });
  } else {
    alert('Digite um CEP válido.');
  }
}

// Telefones
editarTelefone(telefone: { numero: string }) {
    if (!this.novoTelefone|| this.novoTelefone.trim().length < 9) {
    this.poNotification.error('Telefone inválido.');
    return;
  }
  this.novoTelefone = telefone.numero;
  this.removerTelefone(telefone); 
}

// Endereços
editarEndereco(endereco: any) {
  this.novoEndereco = { ...endereco }; 
  this.removerEndereco(endereco); 
}


}
