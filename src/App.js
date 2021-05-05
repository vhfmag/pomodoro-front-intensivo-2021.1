import { useEffect, useState } from "react";
import "./styles.css";

const modosPadrao = [
  {
    conteudo: "pomodoro",
    valor: "pomodoro",
    duracao: 25 * 60
  },
  {
    conteudo: "pausa curta",
    valor: "short break",
    duracao: 5 * 60
  },
  {
    conteudo: "pausa longa",
    valor: "long break",
    duracao: 15 * 60
  }
];

const fontes = [
  {
    nome: "Kumbh Sans",
    classe: "kumbh"
  },
  {
    nome: "Roboto Slab",
    classe: "roboto"
  },
  {
    nome: "Space Mono",
    classe: "space"
  }
];

const cores = ["--vermelho", "--ciano", "--roxo"];

const modoPadrao = modosPadrao[0];

export default function App() {
  const [modos, setModos] = useState(modosPadrao);
  const [valorModoAtual, setValorModoAtual] = useState(modoPadrao.valor);
  const [estaContando, setEstaContando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(modoPadrao.duracao);

  const [modalAberto, setModalAberto] = useState(true);
  const [fonteAtual, setFonteAtual] = useState(fontes[0].classe);
  const [corAtual, setCorAtual] = useState(cores[0]);

  const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
  const segundos = String(tempoRestante % 60).padStart(2, "0");

  const modoAtual = modos.find((modo) => modo.valor === valorModoAtual);

  useEffect(() => {
    const modo = modos.find((modo) => modo.valor === valorModoAtual);
    setTempoRestante(modo.duracao);
    setEstaContando(false);
  }, [valorModoAtual, modoAtual.duracao]);

  useEffect(() => {
    if (estaContando) {
      const intervalId = setInterval(() => {
        setTempoRestante((tempoRestante) => {
          if (tempoRestante > 0) {
            return tempoRestante - 1;
          } else {
            return 0;
          }
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [estaContando]);

  return (
    <div
      className={`App ${fonteAtual}`}
      style={{ "--cor-de-destaque": `var(${corAtual})` }}
    >
      <h1>pomodoro</h1>

      <div className="modo">
        {modos.map((modo) => (
          <button
            className={valorModoAtual === modo.valor ? "selecionado" : ""}
            onClick={() => setValorModoAtual(modo.valor)}
          >
            {modo.conteudo}
          </button>
        ))}
      </div>

      <div className="contagem">
        <div className="firula">
          <div className="tempo">
            {minutos}:{segundos}
          </div>
          <button
            onClick={() => {
              setEstaContando((estaContando) => !estaContando);
            }}
          >
            {estaContando ? "pause" : "iniciar"}
          </button>
        </div>
      </div>

      <button
        className="configuracoes"
        title="Configurações"
        onClick={() => setModalAberto(true)}
      >
        <img src="/engrenagem.svg" alt="Configurações" />
      </button>

      <div className={`overlay ${modalAberto ? "" : "fechado"}`}>
        <div className="modal">
          <header>
            <h2>Configurações</h2>
            <button
              aria-label="Fechar modal"
              title="Fechar modal"
              onClick={() => setModalAberto(false)}
            >
              &times;
            </button>
          </header>
          <form>
            <section className="vertical">
              <h3>Tempo (minutos)</h3>
              <div className="lado-a-lado">
                {modos.map((modo) => (
                  <label>
                    <span class="label">{modo.conteudo}</span>
                    <input
                      value={modo.duracao / 60}
                      type="number"
                      min={1}
                      onChange={(event) => {
                        const novaDuracao = event.target.valueAsNumber;
                        console.log({ novaDuracao });
                        setModos((modos) => {
                          return modos.map((novoModo) => {
                            if (novoModo.valor === modo.valor) {
                              return { ...novoModo, duracao: novaDuracao * 60 };
                            } else {
                              return novoModo;
                            }
                          });
                        });
                      }}
                    />
                  </label>
                ))}
              </div>
            </section>
            <section className="horizontal">
              <h3>Fonte</h3>
              <div className="botoes">
                {fontes.map((fonte) => (
                  <button
                    type="button"
                    className={`${fonte.classe} ${
                      fonte.classe === fonteAtual ? "selecionado" : ""
                    }`}
                    aria-label={fonte.nome}
                    onClick={() => setFonteAtual(fonte.classe)}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </section>
            <section className="horizontal">
              <h3>Cor</h3>
              <div className="botoes">
                {cores.map((cor) => (
                  <button
                    type="button"
                    className={`cor ${cor === corAtual ? "selecionado" : ""}`}
                    style={{ backgroundColor: `var(${cor})` }}
                    onClick={() => setCorAtual(cor)}
                  >
                    <img src="/check.svg" alt="" />
                  </button>
                ))}
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
