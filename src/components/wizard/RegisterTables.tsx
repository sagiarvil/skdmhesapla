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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-600">
              <th className="py-2 pr-2">ID</th>
              <th className="py-2 pr-2">
                Kategori <RegisterColumnHelp columnKey="g_category" />
              </th>
              <th className="py-2 pr-2">
                CN / GTİP <RegisterColumnHelp columnKey="g_cn" />
              </th>
              <th className="py-2 pr-2">
                Rota <RegisterColumnHelp columnKey="g_route" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {goods.map((g, i) => (
              <tr key={g.id} className="border-b border-line/60">
                <td className="py-2 font-mono">{g.id}</td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
                    value={g.category}
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, category: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={g.cn}
                    placeholder="7208…"
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, cn: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
                    value={g.route}
                    onChange={(e) => {
                      const next = [...goods];
                      next[i] = { ...g, route: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="text-accent-yellow"
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
        className="mt-3 rounded-ctl border border-brand-800 px-3 py-2 text-xs font-semibold text-brand-800"
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
    <div>
      <p className="mb-2 text-[11px] text-ink-600">
        Resmi şablon sınırı: P1–P10 ({processes.length}/{MAX_PROCESSES})
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-600">
              <th className="py-2 pr-2">ID</th>
              <th className="py-2 pr-2">
                Süreç adı <RegisterColumnHelp columnKey="p_name" />
              </th>
              <th className="py-2 pr-2">
                Kapsanan kategoriler <RegisterColumnHelp columnKey="p_bubble" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {processes.map((p, i) => (
              <tr key={p.id} className="border-b border-line/60">
                <td className="py-2 font-mono">{p.id}</td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-600">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">
                Yöntem <RegisterColumnHelp columnKey="b_method" />
              </th>
              <th className="py-2 pr-2">
                Kaynak akışı <RegisterColumnHelp columnKey="b_name" />
              </th>
              <th className="py-2 pr-2">
                Süreç <RegisterColumnHelp columnKey="b_process" />
              </th>
              <th className="py-2 pr-2">
                AD <RegisterColumnHelp columnKey="b_ad" />
              </th>
              <th className="py-2 pr-2">Birim</th>
              <th className="py-2 pr-2">
                NCV <RegisterColumnHelp columnKey="b_ncv" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {streams.map((s, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-2 font-mono">{i + 1}</td>
                <td className="py-2 pr-2">
                  <select
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
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
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
                    value={s.name}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, name: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <select
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
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
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={s.ad}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, ad: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-16 rounded-ctl border border-line px-2"
                    value={s.unit}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, unit: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={s.ncv}
                    disabled={s.method !== "Combustion"}
                    onChange={(e) => {
                      const next = [...streams];
                      next[i] = { ...s, ncv: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="text-accent-yellow"
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
        className="mt-3 rounded-ctl border border-brand-800 px-3 py-2 text-xs font-semibold text-brand-800"
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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-600">
              <th className="py-2 pr-2">Öncül madde</th>
              <th className="py-2 pr-2">
                Toplam (t) <RegisterColumnHelp columnKey="e_total" />
              </th>
              <th className="py-2 pr-2">
                Tesis içi (t) <RegisterColumnHelp columnKey="e_internal" />
              </th>
              <th className="py-2 pr-2">
                Diğer (t) <RegisterColumnHelp columnKey="e_other" />
              </th>
              <th className="py-2 pr-2">
                Kaynak <RegisterColumnHelp columnKey="e_source" />
              </th>
              <th className="py-2 pr-2">
                SEE <RegisterColumnHelp columnKey="e_see" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {precs.map((p, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-2 pr-2">
                  <input
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
                    value={p.name}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, name: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={p.total}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, total: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={p.internal}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, internal: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={p.other}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, other: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="py-2 pr-2">
                  <select
                    className="min-h-10 w-full rounded-ctl border border-line px-2"
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
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className="min-h-10 w-full rounded-ctl border border-line px-2 font-mono"
                    value={p.see}
                    disabled={p.source.includes("AB")}
                    onChange={(e) => {
                      const next = [...precs];
                      next[i] = { ...p, see: Number(e.target.value) || 0 };
                      onChange(next);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="text-accent-yellow"
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
        className="mt-3 rounded-ctl border border-brand-800 px-3 py-2 text-xs font-semibold text-brand-800"
      >
        + Öncül madde ekle
      </button>
    </div>
  );
}
