import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryDBService<T extends Record<string, any>> {
  private records: Map<string | number, T & { id: string | number }> =
    new Map();
  private idCounter = 1;

  /**
   * Cria um novo registro com ID automático
   * @param data - O objeto a ser armazenado (sem ID)
   * @param dataId - objeto para id customizada
   * @returns O objeto armazenado com ID gerado
   */
  create(data: T, dataId?: string | number): T & { id: string | number } {
    const id = dataId ? dataId : this.idCounter++;
    const record = { ...data, id };
    this.records.set(id, record);
    return record;
  }

  /**
   * Busca um registro por ID
   * @param id - ID do registro
   * @returns O registro encontrado ou undefined
   */
  findOne(id: string | number): (T & { id: string | number }) | undefined {
    return this.records.get(id);
  }

  /**
   * Busca todos os registros que correspondem aos critérios
   * @param criteria - Critérios de filtro opcionais
   * @returns Array de registros correspondentes
   */
  findAll(criteria?: Partial<T>): Array<T & { id: string | number }> {
    const records = Array.from(this.records.values());
    if (!criteria || Object.keys(criteria).length === 0) {
      return records;
    }

    return records.filter((record) => {
      return Object.entries(criteria).every(([key, value]) => {
        if (!(key in record)) return false;
        if (value && typeof value === 'object') {
          return JSON.stringify(record[key]) === JSON.stringify(value);
        }
        return record[key] === value;
      });
    });
  }

  /**
   * Atualiza um registro
   * @param id - ID do registro
   * @param updates - Dados parciais para atualização
   * @returns O registro atualizado ou undefined se não encontrado
   */
  update(
    id: string | number,
    updates: Partial<T>,
  ): (T & { id: string | number }) | undefined {
    const record = this.findOne(id);
    if (!record) return undefined;

    const updatedRecord = { ...record, ...updates };
    this.records.set(id, updatedRecord);
    return updatedRecord;
  }

  /**
   * Remove um registro
   * @param id - ID do registro
   * @returns true se removido, false se não encontrado
   */
  delete(id: string | number): boolean {
    return this.records.delete(id);
  }

  /**
   * Limpa todos os registros (útil para testes)
   */
  clear(): void {
    this.records.clear();
    this.idCounter = 1;
  }

  /**
   * Retorna a quantidade de registros armazenados
   */
  get count(): number {
    return this.records.size;
  }
}
