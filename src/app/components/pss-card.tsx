import { motion } from "motion/react";
import { Heart, ArrowRight, Clock, DollarSign, Users, Briefcase } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { useState } from "react";

type Status = "open" | "closing" | "closed" | "soon" | "last-day";

interface PssData {
  id: string;
  cargo: string;
  orgao: string;
  municipio: string;
  estado: string;
  regiao: string;
  populacao: number;
  salario: number;
  cargaHoraria: number;
  vagas: number;
  cadastroReserva: boolean;
  dataInicio: string;
  dataFim: string;
  diasRestantes: number;
  status: Status;
}

interface PssCardProps {
  pss: PssData;
  index?: number;
}

export function PssCard({ pss, index = 0 }: PssCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const formatSalario = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const formatPopulacao = (valor: number) => {
    return new Intl.NumberFormat("pt-BR").format(valor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative group min-w-[340px]"
    >
      <div className="radix-card radix-card-hover p-6">
        <div className="mb-4">
          <StatusBadge status={pss.status} />
        </div>

        <div className="space-y-2 mb-5">
          <h3 className="text-[16px] font-semibold text-text-primary leading-tight">
            {pss.cargo}
          </h3>
          <p className="text-[14px] text-text-secondary">
            {pss.orgao} — {pss.estado}
          </p>
          <p className="text-[12px] text-text-secondary">
            {pss.regiao} · {formatPopulacao(pss.populacao)} hab.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="text-[14px] font-bold text-text-primary leading-tight mb-1">
              {formatSalario(pss.salario).replace("R$", "").trim()}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              Salário
            </div>
          </div>

          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="text-[14px] font-bold text-text-primary leading-tight mb-1">
              {pss.cargaHoraria}h
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              CH
            </div>
          </div>

          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="text-[14px] font-bold text-text-primary leading-tight mb-1">
              {pss.vagas.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              Vagas
            </div>
          </div>

          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Briefcase className="w-4 h-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="text-[14px] font-bold text-text-primary leading-tight mb-1">
              {pss.cadastroReserva ? "Sim" : "Não"}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              CR
            </div>
          </div>
        </div>

        <div className="mb-5 space-y-2 border-b border-divider pb-5">
          <div className="flex items-center gap-2 text-[12px] text-text-secondary">
            <span>📅</span>
            <span>Inscrição: {pss.dataInicio} a {pss.dataFim}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span>⏳</span>
            <span className={pss.diasRestantes <= 7 ? "text-urgency-red font-medium" : "text-accent-gold-text"}>
              Faltam {pss.diasRestantes} dias
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-accent-gold-text transition-colors duration-200"
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? "fill-accent-gold-text text-accent-gold-text" : ""}`}
              strokeWidth={2}
            />
            Salvar
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold text-white transition-all duration-300 hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(135deg, #C5A55A, #0D7C66)',
              boxShadow: '0 2px 8px rgba(197, 165, 90, 0.35)',
            }}
          >
            Ver edital
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
