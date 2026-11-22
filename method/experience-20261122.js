(function install() {
  "use strict";

  // Production data. No testing controls, version badges, or preview-only panels.
  const tree = {
    root: { label:"根｜経営の土台", title:"経営を支える土台", desc:"目的を共有し、ルール化・見える化・判断基準・責任の明確化・原価把握・予算と実績・検証と改善の仕組みを整えます。", words:["目的の共有","ルール化","見える化","判断基準","責任の明確化","原価把握","予算と実績","検証と改善"] },
    trunk:{ label:"幹｜管理会計", title:"判断をつなぐ管理会計", desc:"根で整えた仕組みを、共通の数字とルールとして運用し、それぞれの判断を組織の意思決定につなげます。", words:["共通の数字","共通のルール","比較・判断","意思決定"] },
    branch:{label:"枝｜立場と役割", title:"それぞれの立場と役割",desc:"経営者は方向を決め、総務経理は仕組みを支え、社員は価値を生み出します。それぞれの役割から考え、行動します。",words:["経営者","総務経理","社員","判断と実行"]},
    flower:{label:"花｜経営の成果",title:"目指す成果と実際の結果",desc:"利益が残る、人が育つ、信頼が生まれる、事業が続く。目指した成果と実際の変化を確かめ、次の改善につなげます。",words:["利益が残る","人が育つ","信頼が生まれる","事業が続く","お金が回る","無駄が減る","判断がそろう","安心して働ける","納得が生まれる","仕事が回る","人が集まる","挑戦できる","地域に根づく"]}
  };
  // Layout coordinates are tuned for the published original 373×350 tree,
  // not the taller stand-alone test illustration.
  const placements = {
    root:[[16,83],[50,83],[83,83],[16,90],[50,90],[83,90],[33,97],[68,97]],
    trunk:[[17,64],[83,64],[17,74],[83,74]],
    branch:[[17,55],[83,55],[17,61],[83,61]],
    flower:[[17,16],[50,16],[83,16],[17,23],[50,23],[83,23],[17,30],[50,30],[83,30],[17,37],[50,37],[83,37],[50,44]]
  };

  TREE_VOCAB.root = tree.root.words;
  TREE_VOCAB.trunk = tree.trunk.words;
  TREE_VOCAB.branch = tree.branch.words;
  TREE_VOCAB.flower = tree.flower.words;

  // Two confirmed themes stay anchored to the existing household figures.
  DATA.education.options.a.question = "家で学ぶ？";
  DATA.education.options.b.question = "学習教室に通う？";
  DATA.education.options.hold.question = "まず体験してみる？";
  DATA.car.options.a.question = "整備して乗り続ける？";
  DATA.car.options.b.question = "買い替える？";
  DATA.car.options.hold.question = "まず点検する？";

  // One-time travel costs are separate from monthly discretionary household spending.
  delete DATA.home;
  DATA.travel = {
    name:"家族旅行の計画",short:"家族旅行",icon:"🧳",
    story:"家族3人で、予算10万円の旅行を計画します。",
    purpose:"家族で役割を分け、予約と支払いを確認し、予算内で旅行を実現する。",
    comparison_intro:"旅行費は預貯金からの一時支出です。3つの方法を選んで、それぞれの結果を見てみましょう。",
    options:{
      a:{name:"役割を分担する",question:"だれが担当？",amount:"旅行予算10万円",detail:"宿泊・移動・持ち物の準備を分ける",impact:"誰が何をするか考える"},
      b:{name:"購入前に確認する",question:"だれが決める？",amount:"旅行予算10万円",detail:"予約・購入する前に目的と条件を確認する",impact:"決める人と確認する人を考える"},
      hold:{name:"支払いを整理する",question:"支払い、どうする？",amount:"旅行予算10万円",detail:"予約日・支払日・カード引落日を分ける",impact:"支払予定と預貯金を確認する"}
    },
    results:{
      a:{
        period:"旅行の準備を分担した後（架空）",
        rows:[["宿泊先の調査","一人が担当","担当と条件を整理"],["移動方法の調査","同じ人に集中","別の家族が担当"],["現地の準備","担当が曖昧","役割と残る準備を共有"],["準備の負担","一人に集中","分担したが負担の偏りは今後確認"]],
        money:"旅行費10万円は預貯金からの一時支出。今回は仕事の分担を整理した段階です。支払いや予約の完了は、まだ確認していません。",
        evaluation:"担当する仕事は明確になりました。ただし、それぞれの作業量が適切かどうかは別に確認する必要があります。",
        next:"準備の手間と残る作業を確かめ、無理なく進められる役割分担を考える。"
      },
      b:{
        period:"予約と確認方法を整えた後（架空）",
        rows:[["宿泊の購入前","確認が不十分","金額・日付・取消条件を家族で確認"],["移動手段の予約","手配済みだと思っていた","予約番号がなく未予約と判明"],["購入の判断","誰が決めるか曖昧","条件と予算を確認してから合意"],["移動手段の購入","見込み25,000円","確認後25,000円をカード決済"]],
        money:"交通費25,000円のカード利用と、後日の預金引落しは別の時点です。購入を決めることと支払いが済むことを区別します。",
        evaluation:"候補を選ぶことと、予約の完了を混同していました。購入前の確認と、購入後の確定情報の照合が必要でした。",
        next:"何を買うか、予算と条件は適切かを確認し、購入後は予約・決済の状況を照合する。"
      },
      hold:{
        period:"旅行費の支払予定を整理した後（架空）",
        rows:[["旅行予算","100,000円","100,000円"],["宿泊費（12/10）","支払予定","60,000円を振込"],["交通費（12/12）","予約・購入予定","25,000円をカード利用、1/27引落"],["現地費（1/15）","現地支出の見込み","20,000円"],["旅行費合計","100,000円以内","105,000円の見込み"],["予算との差","超過なし","5,000円超過"],["旅行費支払後の貯蓄","2,000,000円から試算","1,895,000円の見込み"]],
        money:"宿泊60,000円、交通25,000円、現地費20,000円で計105,000円。カード利用日は預貯金の引落日とは異なります。通常の給与・生活費の動きは別に管理します。",
        evaluation:"旅行費は予算を5,000円超える見込みでした。支出総額と実際に預貯金から引き落とされる時期は、分けて管理する必要があります。",
        next:"旅行内容や予算を見直し、カード引落日まで含めた資金予定を更新する。"
      }
    }
  };

  DISPLAY36["travel-a"]={rows:[],note:"旅行予算10万円は預貯金から支払う一時支出です。準備の分担が今回の主題です。"};
  DISPLAY36["travel-b"]={rows:[],note:"購入の判断・予約の確定・カード引落しを区別します。"};
  DISPLAY36["travel-hold"]={rows:[],note:"2026年12月10日宿泊費振込、12月12日交通費カード利用、2027年1月15日現地費支出、1月27日カード引落しという架空設定。"};
  WORK.travel={title:"会社の購買業務なら？",purpose:"必要なものを、適切な役割と判断基準で購入し、資金の動きも管理する。"};

  const questions = {
    education:["家で学ぶ？","学習教室に通う？","まず体験してみる？"],
    car:["整備して乗り続ける？","買い替える？","まず点検する？"],
    travel:["だれが担当？","だれが決める？","支払い、どうする？"]
  };
  const cases={
    "education-a":{
      goal:"自社で担う業務の範囲と負担を判断する。",
      question:"自社で行えば、負担は少ない？",
      body:"自社で対応すれば外部への支払いは抑えられるかもしれません。しかし担当者の時間やほかの仕事への影響を含めても合理的でしょうか。必要な仕事量と社内の対応能力から、担う範囲を考えます。",
      roles:"経営者は内製の必要性、総務経理は費用と時間、社員は実際の仕事量を確認します。",
      metrics:"作業時間・発生費用・業務の達成状況",
      takeaway:"外部支出が少ないことと、会社全体の負担が小さいことは別です。",
      tree:["業務範囲と負担の評価基準を整える。","作業時間・費用・成果を比較する。","経営・管理・実行の立場から確認する。","無理のない業務体制か確かめる。"]
    },
    "education-b":{
      goal:"外部の専門性を活かし、成果と社内に残る負担を管理する。",
      question:"外部に任せれば、負担は減る？",
      body:"専門家の活用で期待した成果を得られることがあります。ただし委託費に加え、社内での確認や調整が残る場合もあります。何を任せ、何を自社で管理するのかを整理します。",
      roles:"経営者は委託目的、総務経理は費用と管理負担、社員は仕事への影響を確認します。",
      metrics:"委託費・社内対応時間・期待した成果",
      takeaway:"外注の成果と会社全体の負担は、分けて評価します。",
      tree:["委託目的と責任範囲を整える。","成果・委託費・社内負担を比較する。","委託判断・管理・実行を分担する。","成果と負担を確かめる。"]
    },
    "education-hold":{
      goal:"小さな試行から、本格委託に必要な判断材料を得る。",
      question:"まず一部を任せてみる？",
      body:"業務の一部を試験的に外部委託し、対応の質や費用を確認する方法があります。試行と本格運用では条件が違います。試して分かったことと、まだ分からないことを区別します。",
      roles:"経営者は試行目的、総務経理は費用と継続条件、社員は業務の変化を確認します。",
      metrics:"試行費用・対応品質・本格運用での予想負担",
      takeaway:"試すことは成功の証明ではなく、判断材料を得ることです。",
      tree:["試行範囲と評価条件を決める。","試行の費用・品質・継続条件を比べる。","試行・検証・実務確認を分担する。","本格運用の成果は未確認。"]
    },
    "car-a":{
      goal:"設備を必要な状態に保ち、予定外の停止を減らす。",
      question:"使い続けるための基準はある？",
      body:"故障してから修理するだけでは安定稼働を守れません。点検基準、保全計画、故障履歴を整え、整備費と設備停止の影響を確かめます。",
      roles:"経営者は事業継続、総務経理は保全費用、社員は設備の状態と使用状況を確認します。",
      metrics:"点検記録・故障履歴・保全費用・停止による影響",
      takeaway:"修理できたことと、安心して使い続けられることは別です。",
      tree:["点検・保全の基準と記録を整える。","保全費用と停止リスクを比較する。","継続判断・費用管理・点検を分担する。","安定稼働を確認する。"]
    },
    "car-b":{
      goal:"設備更新の費用と効果、資金余力を比較する。",
      question:"新しくすれば、経済的になる？",
      body:"新しい設備で維持費や作業負担が減ることもありますが、初期投資と将来の維持費、資金の余裕を分けて考える必要があります。比較期間と条件をそろえます。",
      roles:"経営者は投資目的、総務経理は資金と総費用、社員は利用上の効果を確認します。",
      metrics:"初期投資・維持費・資金余力・更新後の効果",
      takeaway:"維持費が下がることと、投資全体が合理的であることは別です。",
      tree:["投資判断の基準と比較期間を定める。","初期投資・維持費・効果を比較する。","投資判断・資金管理・利用評価を分担する。","更新後の効果は運用後に確かめる。"]
    },
    "car-hold":{
      goal:"予備部品の必要性と適正数量を根拠に基づいて判断する。",
      question:"故障してから手配しても間に合う？ 予備は何を、いくつ持っておく？",
      body:"必要な部品がすぐ手に入るとは限りません。一方、使わない予備品を多く持つと資金や保管場所が必要です。故障頻度、調達時間、業務が止まる影響を比べ、必要な部品と適正数量を判断します。",
      roles:"経営者は停止リスク、総務経理は在庫と保有費用、社員は部品の必要性と使用状況を確認します。",
      metrics:"故障頻度・調達期間・停止影響・保有費用・予備品在庫",
      takeaway:"在庫があるかではなく、なぜその部品を、その数量だけ持つのか。",
      tree:["予備品の必要性と適正数量の基準を決める。","欠品リスクと保有負担を比べる。","リスク判断・在庫管理・現場確認を分担する。","欠品・過剰在庫の改善は運用後に検証する。"]
    },
    "travel-a":{
      goal:"必要な購買業務を洗い出し、仕事量に応じて役割を分ける。",
      question:"仕事を分担しただけで、負担は適切になる？",
      body:"使用部門からの依頼、見積りの収集、仕入先との調整、発注、受領確認、記録。こうした仕事を一人が抱えている場合、作業ごとに分け、誰がどこで引き継ぐかを整理します。担当を決めた後も、仕事量の偏りを確認します。",
      roles:"使用部門は用途と必要量、購買担当は候補調査や発注、総務経理は記録と支払情報を担当します。",
      metrics:"作業内容・担当・件数・時間・未完了・引継ぎ",
      takeaway:"誰の仕事かを決めるだけでなく、無理なく仕事が回る分担かを確かめます。",
      tree:["作業範囲・引継ぎ・負担を確認するルールを整える。","作業量と必要な人員・時間を把握する。","使用部門・購買・総務経理が担当する。","業務の偏りが改善したか確認する。"]
    },
    "travel-b":{
      goal:"購入の必要性を確認し、権限者の決裁後に発注する。",
      question:"必要だと思えば、誰でも発注してよい？",
      body:"誰でも必要と思ったものを買える状態では、用途や金額の妥当性が確認できません。購買申請書に「いつ・どこで・誰が・何を・何のために・いくらで購入するか」を記載し、使用・販売目的、数量、仕入先、支払条件を確認します。権限者の決裁後に発注し、受領・請求内容も照合します。",
      roles:"使用・販売部門が申請し、担当者が用途と予算を確認。権限者が決裁し、購買担当が発注、経理が請求と支払いを管理します。",
      metrics:"購入目的・品名数量・金額・仕入先・支払条件・決裁履歴・検収状況",
      takeaway:"購入の目的と条件を確かめ、発注前に判断する仕組みが必要です。",
      steps:["購入目的と用途・必要時期を申請","金額・条件・予算を確認","権限者が決裁","発注・受領・請求を照合"],
      tree:["購買申請・決裁権限・検収のルールを整える。","目的と費用・条件に沿って判断する。","申請・確認・決裁・発注・経理を分担する。","不要な購入や無承認発注の減少を確認する。"]
    },
    "travel-hold":{
      goal:"仕入価格だけでなく、支払サイトと売掛金回収サイトを踏まえ購買判断する。",
      question:"仕入価格が安くても、入金より先に現金が出ていない？",
      body:"ある会社では、用途や販売先が曖昧なまま現金で仕入れ、主要取引先の売上代金は月末締め・翌々月末回収でした。購買申請書で購入目的や必要時期を明らかにしたうえで、仕入先の価格・品質・納期・支払条件を比較します。最安の現金仕入れだけでなく、掛仕入れで支払時期を回収日に近づける方法も検討します。",
      roles:"使用・販売部門は購入目的を申請、購買は仕入先と条件を比較、総務経理は買掛金支払いと売掛金回収を照合、決裁者は価格と資金負担を踏まえて判断します。",
      metrics:"購入目的・仕入価格・支払条件・売掛金回収予定・買掛金支払予定・必要運転資金",
      takeaway:"仕入価格の安さだけでなく、いつ支払い、いつ代金が入るかまで判断します。",
      compare:[["現金仕入れ","70,000円","12月10日"],["掛仕入れ（買掛金）","72,000円","2月28日"]],
      compareNote:"12月に10万円で販売し、売掛金は月末締め・翌々月末（2月28日）入金と仮定。掛仕入れの粗利益は2万8,000円、現金仕入れは3万円。掛仕入れは2,000円高い一方、先行する資金負担を軽減できます。入金と支払いが同日でも決済順序に注意が必要で、掛仕入れの条件は仕入先との合意が前提です。",
      tree:["購買申請・仕入条件・売掛金回収予定の共有を整える。","価格・支払時期・運転資金を比較する。","販売・購買・経理・経営が役割を担う。","資金の先払い負担と無駄な仕入れを検証する。"]
    }
  };

  const reviews={
    "education-a":["学習は週3回の予定が週2回。費用とサポート時間は見込みを超えました。","続けられたことを評価するか、目標回数の不足が気になるかで見方は変わります。","子どもの意欲と家族の負担を確認し、続け方を見直しましょう。"],
    "education-b":["学習は週3回の目標を達成しましたが、月謝は自由残額を2,000円超え、送迎時間も増えました。","学習の成果と家族の負担を分けて考えましょう。","費用と送迎を調整できるか確認し、続ける条件を考えます。"],
    "education-hold":["2回の体験に参加して1,000円を使いました。","参加できたことと、学習を継続できることは別です。","本人の感想、通う負担、継続費用を調べて次を判断します。"],
    "car-a":["整備費は予定12万円から14万円へ増えました。","修理したことだけで将来の安全性や使用期間は分かりません。","点検記録・整備箇所・今後の保全予定を確かめましょう。"],
    "car-b":["購入費は98万円、燃料費は月4,080円減りました。","貯蓄は102万円に減り、維持費の改善だけでは更新の妥当性は判断できません。","税金・保険・整備費も含めた長期の負担を比べます。"],
    "car-hold":["点検費6,000円で修理が必要な部品1件と見積り3万円が分かりました。","点検しただけでは、安全性や修理後の改善はまだ分かりません。","必要性と緊急度を確認し、整備か更新かを判断します。"],
    "travel-a":["宿泊・移動・持ち物の準備を分担しました。","担当が決まっても仕事量の偏りがなくなったとは限りません。","手間と残る作業を確認し、分担を調整します。"],
    "travel-b":["予約したつもりだった移動手段が、実は未予約でした。","候補を選ぶこと、購入を認めること、予約が完了することは別です。","購入前に目的と条件を確認し、購入後に確定内容を照合します。"],
    "travel-hold":["旅行費の見込みは10万5,000円。予算を5,000円超えます。","カードで購入した日と預貯金から引き落とされる日は異なります。","旅行内容と予算を見直し、引落日まで資金予定を管理します。"]
  };
  for(const [key,arr] of Object.entries(reviews))V3_REVIEWS[key]=arr;

  for(const [key,v] of Object.entries(cases)){
    SHORT_REVIEW[key]={
      "会社で考える目的":v.goal,"会社の場面で":v.body,
      "立場で見ると":v.roles,"確かめる数字":v.metrics,
      question:v.question,takeaway:v.takeaway,steps:v.steps||[],
      compare:v.compare||null,compareNote:v.compareNote||"",
      tree:{root:v.tree[0],trunk:v.tree[1],branch:v.tree[2],flower:v.tree[3]}
    };
  }
  // Previous third theme is no longer selectable.
  for (const key of ["home-a","home-b","home-hold"]) {
    delete SHORT_REVIEW[key];delete V3_REVIEWS[key];delete DISPLAY36[key];
  }

  INTRO[4].parts=[["経営の土台","根｜仕組み"],["判断をつなぐ","幹｜管理会計"],["それぞれの役割","枝｜立場"],["目指す成果と結果","花｜成果"]];
  INTRO[4].end="経営の土台をつくり、管理会計で判断をつなぎ、それぞれの役割から行動する。実際の結果を確かめ、必要なら土台や判断を見直します。";
  V3_QUESTIONS[4][3]="経営の土台を整え、管理会計で判断をつなぎ、それぞれの役割で行動する。結果を確かめ、必要に応じて仕組みを見直しながら、改善を続けます。";

  const escapeHtml = (x)=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const pairs=[["root","根"],["trunk","幹"],["branch","枝"],["flower","花"]];

  // Preserve the original published tree artwork and site-wide navigation.
  treeDiagram=function(finalMode=false,overview=false){
    const chosen=finalMode?SHORT_REVIEW[S.topic+"-"+S.decision]:null;
    const wordCloud=pairs.map(([key])=>{
      const words=tree[key].words;
      return `<div class="method-words ${key}" aria-hidden="true">${words.map((t,i)=>{
        const p=placements[key][i];return `<span class="method-word" style="left:${p[0]}%;top:${p[1]}%">${escapeHtml(t)}</span>`;
      }).join("")}</div>`;
    }).join("");
    const content= pairs.map(([key,label])=>{
      const section=tree[key];
      const extra=finalMode&&chosen?.tree?.[key]?`<div class="method-example"><b>今回の会社の事例では</b><p>${escapeHtml(chosen.tree[key])}</p></div>`:"";
      return `<div data-tree-content="${key}" hidden><strong>${section.title}</strong><p>${section.desc}</p>${extra}</div>`;
    }).join("");
    return `<div class="concept-tree method-tree" data-tree-block>
      <div class="concept-tree-graphic" data-current-part="overview">
        <div class="concept-tree-art" data-original-tree>${FALLBACK_TREE}</div>
        ${wordCloud}
        <div class="method-label flower">花｜経営の成果</div>
        <div class="method-label branch">枝｜立場と役割</div>
        <div class="method-label trunk">幹｜管理会計</div>
        <div class="method-label root">根｜経営の土台</div>
        ${pairs.map(([key,label])=>`<button type="button" class="tree-hit ${key}" data-tree-part="${key}" aria-label="${label}の意味を表示"></button>`).join("")}
      </div>
      <div class="concept-tree-content">
        <div class="concept-tree-tabs" aria-label="木の部分を選ぶ">
          ${pairs.map(([key])=>`<button type="button" data-tree-part="${key}" aria-pressed="false">${tree[key].label}</button>`).join("")}
        </div>
        <div class="concept-tree-explain" aria-live="polite">
          <div data-tree-content="overview"><strong>木の各部分を選ぶ</strong><p>根・幹・枝・花のボタンを押すと、要素が図の中に現れ、意味を確認できます。</p></div>
          ${content}
        </div>
      </div>
    </div>`;
  };

  // Household selection is intentionally short; company terminology appears at stage 04.
  compare36=function(){
    const q=theme(),ks=["a","b","hold"],id=S.topic;
    return `<div class="method-family-choices" role="group" aria-label="あなたならどこから考える？">
      <h2>あなたなら、どこから考える？</h2>
      ${ks.map((k,i)=>{const o=q.options[k],selected=S.decision===k;
        return `<button type="button" class="method-choice ${selected?"selected":""}" data-decision="${k}" data-choice-key="${k}" aria-pressed="${selected}">
          <span>選択 ${"ABC"[i]}</span><strong>${escapeHtml(o.question||questions[id][i])}</strong><small>この進め方で結果を見る →</small>
        </button>`;}).join("")}
      </div>`;
  };
  const originalHousehold=household;
  household=function(){
    // Keep the familiar household table and choice/response flow; replace the old
    // result selection table with the three approved short questions.
    return originalHousehold().replace('<h2>方法を比べて、そのまま選ぶ</h2>','')
      .replace('A案・B案・保留のどれかを選ぶと','A・B・Cのどれかを選ぶと');
  };

  company=function(){
    const review=shortReview(),q=theme();
    const steps=review.steps?.length?`<div class="method-business-flow"><h3>仕事の流れ</h3><div>${review.steps.map((v,i)=>`<p><b>${i+1}</b> ${escapeHtml(v)}</p>`).join("")}</div></div>`:"";
    const comparison=review.compare?`<div class="method-business-compare"><h3>現金仕入れと掛仕入れの比較（架空）</h3>
      <div class="tablewrap"><table class="resulttable"><thead><tr><th>方法</th><th>仕入価格</th><th>支払日</th></tr></thead><tbody>
      ${review.compare.map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="condition36">${escapeHtml(review.compareNote)}</p></div>`:"";
    return `<section class="company-explanation company-lean">
      <div class="eyebrow company-stage">04 会社なら｜会社ではどう考える？</div>
      <h1 class="qhead">${escapeHtml(review.question)}</h1>
      <p class="story-lead">家計で選んだ考え方を、会社の仕事に置き換えてみましょう。</p>
      ${selectionRibbon()}
      <div class="goalbox"><small>会社で考える目的</small><strong>${escapeHtml(review["会社で考える目的"])}</strong></div>
      <div class="company-point company-mainpoint"><small>会社の具体例</small><p>${escapeHtml(review["会社の場面で"])}</p></div>
      ${steps}${comparison}
      <div class="company-point"><small>立場で見ると</small><p>${escapeHtml(review["立場で見ると"])}</p></div>
      <div class="company-point"><small>確かめる数字・情報</small><p>${escapeHtml(review["確かめる数字"])}</p></div>
      <p class="method-takeaway"><strong>${escapeHtml(review.takeaway)}</strong></p>
      <section class="story-company-bridge">
      <h2>異なる判断をつなぐ、共通の土台。</h2>
      <div class="story-roles"><div><strong>経営者</strong><span>方向を決める</span></div>
      <div><strong>総務経理</strong><span>仕組みを支える</span></div>
      <div><strong>社員</strong><span>実行・改善する</span></div></div>
      <div class="story-join" aria-hidden="true"></div><div class="story-common"><strong>共通の目的・数字・ルール</strong>
      <p>立場は違っても、共通の情報と基準で判断する。</p></div></section>
      </section>`;
  };

  // The earlier downloadable PDFs describe old scenarios. Do not display stale links.
  const oldFinal=finalView;
  finalView=function(){
    oldFinal();
    const stale=app.querySelector(".pdf-takeaway");
    if(stale)stale.remove();
  };
  const oldIntro=introduction;
  introduction=function(){
    oldIntro();
    const lead=app.querySelector(".intro-tree-first .tree-lead");
    if(lead)lead.textContent="経営を支える土台から、管理会計とそれぞれの役割を通じて成果へ。木の部分を選んで意味を確認できます。";
  };

  const css=`
    .method-tree .tree-focus-overlay,.method-tree .tree-focus-label{display:none!important}
    .method-tree .concept-tree-graphic{isolation:isolate}
    .method-tree .method-label{position:absolute;z-index:7;pointer-events:none;white-space:nowrap;
      transform:translate(-50%,-50%);padding:2px 6px;background:rgba(255,255,255,.92);
      border:1px solid #d5e4d8;color:#275940;border-radius:6px;font-weight:800;font-size:clamp(9px,1.1vw,11px)}
    .method-tree .method-label.flower{top:8%;left:50%}
    .method-tree .method-label.branch{top:51%;left:50%}
    .method-tree .method-label.trunk{top:69%;left:50%}
    .method-tree .method-label.root{top:76%;left:50%}
    .method-tree .method-words{position:absolute;inset:0;z-index:6;display:none;pointer-events:none;overflow:hidden}
    .method-tree .concept-tree-graphic[data-current-part="root"] .method-words.root,
    .method-tree .concept-tree-graphic[data-current-part="trunk"] .method-words.trunk,
    .method-tree .concept-tree-graphic[data-current-part="branch"] .method-words.branch,
    .method-tree .concept-tree-graphic[data-current-part="flower"] .method-words.flower{display:block}
    .method-tree .method-word{position:absolute;transform:translate(-50%,-50%);display:block;white-space:nowrap;
      padding:2px 3px;border:1px solid #d6e6d9;border-radius:5px;background:rgba(255,255,255,.95);
      color:#27573a;font-size:clamp(9px,.96vw,11px);font-weight:750;line-height:1.4}
    .method-tree .method-words.root .method-word{border-color:#e8d7c4;color:#765b43}
    .method-tree .tree-hit{z-index:8}
    .method-tree .tree-hit:hover{background:transparent}
    .method-tree .concept-tree-explain{min-height:92px}
    .method-tree .method-example{margin-top:11px;padding-top:10px;border-top:1px solid #dbe7dc}
    .method-tree .method-example p{margin:4px 0 0}
    .method-family-choices{display:grid;grid-template-columns:1fr;gap:9px;margin:16px 0}
    .method-family-choices h2{font-size:1.2rem;margin:0 0 2px}
    .method-family-choices .method-choice{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:5px;
      width:100%;padding:15px 17px;border:1px solid #cbded0;border-radius:13px;background:#fff;
      cursor:pointer;color:#203a2a}
    .method-family-choices .method-choice.selected{border:2px solid #236b47;padding:14px 16px;background:#f1f8f2}
    .method-family-choices .method-choice:hover{border-color:#468465}
    .method-family-choices .method-choice span,.method-family-choices .method-choice small{
      font-size:.79rem;color:#266548;font-weight:800}
    .method-family-choices .method-choice strong{font-size:1.06rem;color:#162d1f}
    .method-business-flow,.method-business-compare{background:#f7faf6;padding:14px;border:1px solid #e0ebe1;border-radius:12px;margin:15px 0}
    .method-business-flow h3,.method-business-compare h3{font-size:1rem;margin:0 0 10px}
    .method-business-flow p{margin:4px 0;line-height:1.65}
    .method-business-flow b{display:inline-flex;background:#266448;color:#fff;border-radius:50%;height:21px;width:21px;align-items:center;justify-content:center;font-size:.76rem}
    .method-takeaway{border-left:3px solid #286448;background:#f2f8f2;padding:12px 15px;margin:16px 0;border-radius:3px 10px 10px 3px}
    .method-takeaway{margin:16px 0;line-height:1.75}
    @media(max-width:650px){
      .method-tree .method-word{font-size:8px;padding:1px 2px}
      .method-tree .method-label{font-size:9px;padding:1px 3px}
      .method-tree .concept-tree-graphic{max-width:310px}
      .method-family-choices .method-choice{min-height:75px}
    }
  `;
  const style=document.createElement("style");
  style.textContent=css;
  document.head.appendChild(style);
  if(app&&!app.hidden&&S.stage==="intro")introduction();
})();