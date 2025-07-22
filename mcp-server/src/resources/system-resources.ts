import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client.js";
import { getBusiestDay } from "./utils/analysis-helpers.js";
import * as fs from 'fs';
import * as path from 'path';

// Carregar dados JSON de forma síncrona
const crudGuideData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/crud-operations-guide.json'), 'utf8')
);

export function registerSystemResources(server: McpServer) {
  // Guia de Operações CRUD
  server.resource(
    "Guia de Operações CRUD",
    "crud-operations://guide",
    { description: "Guia completo de operações CRUD disponíveis" },
    async () => {
      return {
        contents: [
          {
            uri: "crud-operations://guide",
            mimeType: "application/json",
            text: JSON.stringify(crudGuideData, null, 2)
          }
        ]
      };
    }
  );

  // Estatísticas do Sistema
  server.resource(
    "Estatísticas do Sistema",
    "system://statistics",
    { description: "Estatísticas em tempo real do sistema de consultas" },
    async () => {
      try {
        const [medicos, pacientes, consultas] = await Promise.all([
          apiClient.get('/doctors'),
          apiClient.get('/patients'),
          apiClient.get('/appointments')
        ]);

        const todosMedicos = Array.isArray(medicos.data) ? medicos.data : medicos.data.doctors || [];
        const todosPacientes = Array.isArray(pacientes.data) ? pacientes.data : pacientes.data.patients || [];
        const todasConsultas = Array.isArray(consultas.data) ? consultas.data : consultas.data.appointments || [];

        // Calcular estatísticas
        const hoje = new Date();
        const hojeStr = hoje.toISOString().split('T')[0];
        
        const consultasHoje = todasConsultas.filter((apt: any) => apt.date === hojeStr);
        const consultasFuturas = todasConsultas.filter((apt: any) => new Date(apt.date) > hoje);
        const consultasCompletas = todasConsultas.filter((apt: any) => apt.status === 'completed' || new Date(apt.date) < hoje);
        const consultasCanceladas = todasConsultas.filter((apt: any) => apt.status === 'cancelled');

        // Especialidades mais comuns
        const contagemEspecialidades = todosMedicos.reduce((acc: any, medico: any) => {
          const especialidade = medico.specialty || 'Clínica Geral';
          acc[especialidade] = (acc[especialidade] || 0) + 1;
          return acc;
        }, {});

        const estatisticas = {
          timestamp: new Date().toISOString(),
          status_sistema: "operacional",
          totais: {
            medicos: todosMedicos.length,
            pacientes: todosPacientes.length,
            consultas: todasConsultas.length
          },
          detalhamento_consultas: {
            hoje: consultasHoje.length,
            futuras: consultasFuturas.length,
            completadas: consultasCompletas.length,
            canceladas: consultasCanceladas.length
          },
          especialidades: Object.entries(contagemEspecialidades)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([especialidade, quantidade]) => ({ especialidade, quantidade })),
          disponibilidade: {
            medicos_com_consultas_hoje: consultasHoje
              .map((apt: any) => apt.doctor_id)
              .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index).length,
            dia_mais_movimentado: getBusiestDay(todasConsultas),
            media_consultas_por_medico: todosMedicos.length > 0 ? Math.round(todasConsultas.length / todosMedicos.length) : 0
          },
          informacoes_operacoes_crud: {
            ferramentas_disponiveis: 13,
            operacoes_leitura: 6,
            operacoes_criacao: 1,
            operacoes_atualizacao: 3,
            operacoes_exclusao: 1,
            operacoes_utilitarias: 2
          }
        };

        return {
          contents: [
            {
              uri: "system://statistics",
              mimeType: "application/json",
              text: JSON.stringify(estatisticas, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: "system://statistics",
              mimeType: "application/json",
              text: JSON.stringify({
                erro: "Não foi possível buscar estatísticas do sistema",
                timestamp: new Date().toISOString(),
                detalhes: error instanceof Error ? error.message : "Erro desconhecido"
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}