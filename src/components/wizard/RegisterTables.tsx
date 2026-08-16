"use client";

import { RegisterColumnHelp } from "@/components/fieldhelp/RegisterColumnHelp";
import {
  MAX_PROCESSES,
  type GoodRow,
  type PrecRow,
  type ProcessRow,
  type StreamRow,
} from "@/lib/skdm/session-store";

type GoodsProps = {
  goods: GoodRow[];
  onChange: (rows: GoodRow[]) => void;
  onAdd: () => void;
};

export function GoodsRegister({ goods, onChange, onAdd }: GoodsProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-100/40 text-ink-800 font-bold">
              <th className="p-3">ID</th>
              <th className="p-3">
                Kategori <RegisterColumnHelp columnKey="g_category" />
              </th>
              <th className="p-3">
                CN / GTİP <RegisterColumnHelp columnKey="g_cn" />
              </th>
              <th className="p-3">
                Rota <RegisterColumnHelp columnKey="g_route" />
              </th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {goods.map((g, i) => (
              <tr key={g.id} className="border-b border-line/60">
                <td className="p-3 font-mono font-bold">{g.id}</td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={g.category}
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, category: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={g.cn}
                    placeholder="7208…"
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, cn: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={g.route}
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, route: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    className="text-lg font-black text-rose-500 hover:text-rose-700 p-2"
                    onClick={() => onChange(goods.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl border-2 border-brand-800 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm hover:bg-brand-50 transition"
      >
        + Mal kategorisi ekle
      </button>
    </div>
  );
}

type ProcProps = {
  processes: ProcessRow[];
  goods: GoodRow[];
  onChange: (rows: ProcessRow[]) => void;
  onAdd: () => void;
};

export function ProcessRegister({ processes, goods, onChange, onAdd }: ProcProps) {
  const atMax = processes.length >= MAX_PROCESSES;
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-ink-600">
        Resmi şablon sınırı: P1–P10 ({processes.length}/{MAX_PROCESSES})
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-100/40 text-ink-800 font-bold">
              <th className="p-3">ID</th>
              <th className="p-3">
                Süreç adı <RegisterColumnHelp columnKey="p_name" />
              </th>
              <th className="p-3">
                Kapsanan kategoriler <RegisterColumnHelp columnKey="p_bubble" />
              </th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {processes.map((p, i) => (
              <tr key={p.id} className="border-b border-line/60">
                <td className="p-3 font-mono font-bold">{p.id}</td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={p.name}
                    onChange={(e) => {
                      const next = [...processes];
                      next[i] = { ...p, name: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <div className="flex flex-wrap gap-1">
                    {goods.length === 0 && (
                      <span className="text-[10px] text-ink-600">önce Katman 2&apos;de kategori ekleyin</span>
                    )}
                    {goods.map((g) => {
                      const on = p.included.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          className={`rounded-pill border px-2 py-0.5 font-mono text-[10px] ${
                            on ? "border-brand-500 bg-brand-100" : "border-line"
                          }`}
                          onClick={() => {
                            const included = on
                              ? p.included.filter((x) => x !== g.id)
                              : [...p.included, g.id];
                            const next = [...processes];
                            next[i] = { ...p, included };
                            onChange(next);
                          }}
                        >
                          {g.id}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="text-accent-yellow"
                    onClick={() => onChange(processes.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={atMax}
        className="mt-3 rounded-ctl border border-brand-800 px-3 py-2 text-xs font-semibold text-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {atMax ? "P1–P10 sınırı doldu" : "+ Üretim süreci ekle"}
      </button>
    </div>
  );
}

type StreamProps = {
  streams: StreamRow[];
  processes: ProcessRow[];
  onChange: (rows: StreamRow[]) => void;
  onAdd: () => void;
};

export function StreamRegister({ streams, processes, onChange, onAdd }: StreamProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-100/40 text-ink-800 font-bold">
              <th className="p-3">#</th>
              <th className="p-3">
                Yöntem <RegisterColumnHelp columnKey="b_method" />
              </th>
              <th className="p-3">
                Kaynak akışı <RegisterColumnHelp columnKey="b_name" />
              </th>
              <th className="p-3">
                Süreç <RegisterColumnHelp columnKey="b_process" />
              </th>
              <th className="p-3">
                AD <RegisterColumnHelp columnKey="b_ad" />
              </th>
              <th className="p-3">Birim</th>
              <th className="p-3">
                NCV <RegisterColumnHelp columnKey="b_ncv" />
              </th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {streams.map((s, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="p-3 font-mono font-bold">{i + 1}</td>
                <td className="p-3">
                  <select
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={s.method}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, method: e.target.value };
                      onChange(next);
                    }}
                  >
                    <option>Combustion</option>
                    <option>Process Emissions</option>
                    <option>Mass balance</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={s.name}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, name: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <select
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={s.processId || ""}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, processId: e.target.value };
                      onChange(next);
                    }}
                  >
                    <option value="">—</option>
                    {processes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={s.ad}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, ad: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-20 rounded-xl border border-line px-3 text-sm font-medium"
                    value={s.unit}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, unit: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={s.ncv}
                    disabled={s.method !== "Combustion"}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, ncv: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    className="text-lg font-black text-rose-500 hover:text-rose-700 p-2"
                    onClick={() => onChange(streams.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl border-2 border-brand-800 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm hover:bg-brand-50 transition"
      >
        + Kaynak akışı ekle
      </button>
    </div>
  );
}

type PrecProps = {
  precs: PrecRow[];
  onChange: (rows: PrecRow[]) => void;
  onAdd: () => void;
};

export function PrecRegister({ precs, onChange, onAdd }: PrecProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-100/40 text-ink-800 font-bold">
              <th className="p-3">Öncül madde</th>
              <th className="p-3">
                Toplam (t) <RegisterColumnHelp columnKey="e_total" />
              </th>
              <th className="p-3">
                Tesis içi (t) <RegisterColumnHelp columnKey="e_internal" />
              </th>
              <th className="p-3">
                Diğer (t) <RegisterColumnHelp columnKey="e_other" />
              </th>
              <th className="p-3">
                Kaynak <RegisterColumnHelp columnKey="e_source" />
              </th>
              <th className="p-3">
                SEE <RegisterColumnHelp columnKey="e_see" />
              </th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {precs.map((p, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="p-3">
                  <input
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={p.name}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, name: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={p.total}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, total: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={p.internal}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, internal: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={p.other}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, other: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <select
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 text-sm font-medium"
                    value={p.source}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, source: e.target.value };
                      onChange(next);
                    }}
                  >
                    <option>Çoklu tesis (ağırlıklı ort.)</option>
                    <option>Tek tesis (gerçek veri)</option>
                    <option>AB kaynaklı (sıfır emisyon)</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    className="min-h-[44px] w-full rounded-xl border border-line px-3 font-mono text-sm font-semibold"
                    value={p.see}
                    disabled={p.source.includes("AB")}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, see: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    className="text-lg font-black text-rose-500 hover:text-rose-700 p-2"
                    onClick={() => onChange(precs.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl border-2 border-brand-800 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm hover:bg-brand-50 transition"
      >
        + Öncül madde ekle
      </button>
    </div>
  );
}
