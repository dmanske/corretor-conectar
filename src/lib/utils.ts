import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função utilitária para filtrar aniversariantes dos próximos N dias (usando lógica da tela de aniversariantes)

/**
 * Filtra aniversariantes para os próximos N dias, incluindo hoje.
 * @param clientes Lista de clientes
 * @param diasLimite Número de dias para o filtro (ex: 7 ou 30)
 * @returns Array de aniversariantes com diasAte
 */
export function filtrarAniversariantesPorPeriodo(clientes: any[], diasLimite: number) {
  // Zerar horas/minutos/segundos para UTC
  const hoje = new Date();
  const hojeUTC = new Date(Date.UTC(
    hoje.getUTCFullYear(),
    hoje.getUTCMonth(),
    hoje.getUTCDate()
  ));

  return clientes
    .filter(cliente => {
      if (!cliente.dataNascimento) return false;
      let dataNascimentoObj;
      if (cliente.dataNascimento.includes('/')) {
        const partes = cliente.dataNascimento.split('/');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[2]),
            parseInt(partes[1]) - 1,
            parseInt(partes[0])
          ));
        }
      } else {
        const partes = cliente.dataNascimento.split('-');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[0]),
            parseInt(partes[1]) - 1,
            parseInt(partes[2])
          ));
        } else {
          dataNascimentoObj = new Date(cliente.dataNascimento); // Fallback
        }
      }
      if (!dataNascimentoObj || !isValid(dataNascimentoObj)) return false;

      const nascimentoEsteAno = new Date(Date.UTC(
        hojeUTC.getUTCFullYear(),
        dataNascimentoObj.getUTCMonth(),
        dataNascimentoObj.getUTCDate()
      ));

      let aniversarioProximo = new Date(nascimentoEsteAno);
      if (
        nascimentoEsteAno.getTime() < hojeUTC.getTime() &&
        !(
          nascimentoEsteAno.getUTCDate() === hojeUTC.getUTCDate() &&
          nascimentoEsteAno.getUTCMonth() === hojeUTC.getUTCMonth()
        )
      ) {
        aniversarioProximo = new Date(Date.UTC(
          hojeUTC.getUTCFullYear() + 1,
          dataNascimentoObj.getUTCMonth(),
          dataNascimentoObj.getUTCDate()
        ));
      }

      // Calcular diferença em dias usando UTC zerado
      const diffMs = aniversarioProximo.getTime() - hojeUTC.getTime();
      const diasAte = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diasAte <= diasLimite && diasAte >= 0;
    })
    .map(cliente => {
      let dataNascimentoObj;
      if (cliente.dataNascimento.includes('/')) {
        const partes = cliente.dataNascimento.split('/');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[2]),
            parseInt(partes[1]) - 1,
            parseInt(partes[0])
          ));
        }
      } else {
        const partes = cliente.dataNascimento.split('-');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[0]),
            parseInt(partes[1]) - 1,
            parseInt(partes[2])
          ));
        } else {
          dataNascimentoObj = new Date(cliente.dataNascimento); // Fallback
        }
      }
      if (!dataNascimentoObj || !isValid(dataNascimentoObj)) {
        return { ...cliente, diasAte: 999 };
      }
      const nascimentoEsteAno = new Date(Date.UTC(
        hojeUTC.getUTCFullYear(),
        dataNascimentoObj.getUTCMonth(),
        dataNascimentoObj.getUTCDate()
      ));
      let aniversarioProximo = new Date(nascimentoEsteAno);
      if (
        nascimentoEsteAno.getTime() < hojeUTC.getTime() &&
        !(
          nascimentoEsteAno.getUTCDate() === hojeUTC.getUTCDate() &&
          nascimentoEsteAno.getUTCMonth() === hojeUTC.getUTCMonth()
        )
      ) {
        aniversarioProximo = new Date(Date.UTC(
          hojeUTC.getUTCFullYear() + 1,
          dataNascimentoObj.getUTCMonth(),
          dataNascimentoObj.getUTCDate()
        ));
      }
      const diffMs = aniversarioProximo.getTime() - hojeUTC.getTime();
      const diasAte = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return {
        id: cliente.id,
        nome: cliente.nome,
        dataNascimento: cliente.dataNascimento,
        telefone: cliente.telefone,
        email: cliente.email,
        diasAte
      };
    })
    .sort((a, b) => a.diasAte - b.diasAte);
}

/**
 * Filtra aniversariantes de um mês específico (UTC)
 * @param clientes Lista de clientes
 * @param mes Número do mês (0 = janeiro, 11 = dezembro)
 * @returns Array de aniversariantes do mês
 */
export function filtrarAniversariantesDoMes(clientes: any[], mes: number) {
  return clientes
    .filter(cliente => {
      if (!cliente.dataNascimento) return false;
      let dataNascimentoObj;
      if (cliente.dataNascimento.includes('/')) {
        const partes = cliente.dataNascimento.split('/');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[2]),
            parseInt(partes[1]) - 1,
            parseInt(partes[0])
          ));
        }
      } else {
        const partes = cliente.dataNascimento.split('-');
        if (partes.length === 3) {
          dataNascimentoObj = new Date(Date.UTC(
            parseInt(partes[0]),
            parseInt(partes[1]) - 1,
            parseInt(partes[2])
          ));
        } else {
          dataNascimentoObj = new Date(cliente.dataNascimento);
        }
      }
      if (!dataNascimentoObj || !isValid(dataNascimentoObj)) return false;
      return dataNascimentoObj.getUTCMonth() === mes;
    })
    .map(cliente => ({ ...cliente }));
}

/**
 * Filtra aniversariantes de hoje (UTC)
 * @param clientes Lista de clientes
 * @returns Array de aniversariantes de hoje
 */
export function filtrarAniversariantesHoje(clientes: any[]) {
  const hoje = new Date();
  return clientes.filter(cliente => {
    if (!cliente.dataNascimento) return false;
    let dataNascimentoObj;
    if (cliente.dataNascimento.includes('/')) {
      const partes = cliente.dataNascimento.split('/');
      if (partes.length === 3) {
        dataNascimentoObj = new Date(Date.UTC(
          parseInt(partes[2]),
          parseInt(partes[1]) - 1,
          parseInt(partes[0])
        ));
      }
    } else {
      const partes = cliente.dataNascimento.split('-');
      if (partes.length === 3) {
        dataNascimentoObj = new Date(Date.UTC(
          parseInt(partes[0]),
          parseInt(partes[1]) - 1,
          parseInt(partes[2])
        ));
      } else {
        dataNascimentoObj = new Date(cliente.dataNascimento);
      }
    }
    if (!dataNascimentoObj || !isValid(dataNascimentoObj)) return false;
    return (
      dataNascimentoObj.getUTCDate() === hoje.getUTCDate() &&
      dataNascimentoObj.getUTCMonth() === hoje.getUTCMonth()
    );
  }).map(cliente => ({ ...cliente, diasAte: 0 }));
}
