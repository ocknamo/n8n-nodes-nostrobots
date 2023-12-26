# チュートリアル：RSS Feed ボットの作成

`n8n-nodes-nostrobots`を使ってRSS Feed をNostrに投稿するボットを作成してみましょう。

## 背景

### n8nとは

ノーコードツールです。ノーコードツールといえば有名どころにZapierやIFTTTなどがありますがそういう感じのワークフロー自動化ツールです。

公式の説明を引用します。

> n8n - ワークフロー自動化ツール
> n8n は、拡張可能なワークフロー自動化ツールです。 フェアコード配布モデルにより、n8n は常にソース コードが表示され、セルフホストで利用でき、独自のカスタム関数、ロジック、アプリを追加できます。 n8n のノードベースのアプローチにより、汎用性が高く、あらゆるものをあらゆるものに接続できます。
> (機械翻訳)

https://github.com/n8n-io/n8n

n8nで組み合わせて使用できるワークフローの部品を"ノード"と呼びます。


### コミュニティノードとは

だれでも自由に作成できてみんなに共有できるノードです。Node.jsで作成することができます。

作成方法はこちら。
- https://docs.n8n.io/integrations/creating-nodes/

雛形やチュートリアルがあるのでそこまで難しくありません。今回は作成方法などは紹介しません。

この`n8n-nodes-nostrobots`もコミュニティノードとして作成されました。


## 準備

### n8nの準備

n8nはコードが公開されておりセルフホストも可能です。利用する簡単な方法としてはお金を払うか、セルフホストする方法があります。

#### お金を払う

月20ユーロでプラットフォームを使用できまるようです。

https://n8n.io/pricing/

#### セルフホスト

DockerもしくはNode.jsを扱えるエンジニアであれば簡単にセルフホストできます。

https://docs.n8n.io/hosting/

またUmbrelを運用している人であればアプリがストアにあるのでワンクリックでインストールできます。

https://apps.umbrel.com/app/n8n

![umbrelAppStore](https://lh3.googleusercontent.com/pw/ABLVV843Y0nvCrczIm9ZdL6wnJ7uMnMBpkN9LANMHUH1cPwSTMKs5uMizBOQtJF0LwFxv3omO09-tqRvyzvz4KAIkKtlTwILHZR-S6cSvpeSHu_Yj9nqM4jZt1lIWef5TRap0hsoMUUeFGkdKMhNMYUvqI7UBw=w1850-h969-s-no-gm?authuser=0)

### コミュニティノードのインストール方法

コミュニティノードの利用はリスクもあるため必ず公式のドキュメントを読み自己責任でインストールしてください。

https://docs.n8n.io/integrations/community-nodes/

n8n-nodes-nostrobotsのインストール方法を解説します。

サイドメニューの`Settings`から`Community nodes`をページに移動し、インストールします

![installDialog](https://lh3.googleusercontent.com/pw/ABLVV8664ZzIcTW8M5-9edEOagk88He5k21cLX7147qlJfJTQFTPtDsZ69hGt0FRsIaBcbPImZu6YP4LbNYARMgyIimoyrqGonS23Bw4-tAWsM7u68QlrgZptZWVjoIWy62azcZlS-35nwK97093IEEIPbQGwA=w1776-h976-s-no-gm?authuser=0)

npm Package Nameに`n8n-nodes-nostrobots`と入力してインストールを実行します

しばらく待つと`Community nodes`一覧に追加されるのでこれでインストール完了です。

![installed](https://lh3.googleusercontent.com/pw/ABLVV872ffdY-2-uw-e9_hUdld20TmS_sV1G9V5iFOEoFAYs9ZWcoUIlwyKGY8fGY7SEju-DwTDv9ORpvSRF5cweztWrhK9wLt-yRjQlKvoAu8lVzuQQTwvbhVFKqN8KLc0N-fgp4UDnwGVa6kCO8hvGD8xmgQ=w1776-h976-s-no-gm?authuser=0)

### その他のノードのインストール

上で説明した方法で`n8n-nodes-rss-feed-trigger`というコミュニティノードをインストールしてください。

https://github.com/joffcom/n8n-nodes-rss-feed-trigger

（一応コードはかるく確認していますがあくまで仕様は自己責任でお願いします）

## ワークフロー作成

Workflows画面の`Add Workflow`からワークフローを追加できます。

![emptyWorkflow](https://lh3.googleusercontent.com/pw/ABLVV86PfZXJJhuXrcCY3l9ZbBhVK6o8eJ18cn6aGUGqlC23POW687RZzxm3UD66DtmkPOd0lp92nxicZ1DtX1UsHC_gpkYn0p25_we86h89rxX0ofYGNwQJ7h14tj5ss-BUNrAbrqwZwAtdbhA8BjMKLKyt5g=w1776-h976-s-no-gm?authuser=0)

### トリガーノードの作成

はじめにトリガーとなるノードを設定します。（n8n-nodes-nostrobotsにはまだトリガーノードは実装されていません）
"+"をクリックして追加メニューを開きます。

トリガーノードとして`n8n-nodes-rss-feed-trigger`を使用したいので検索フォームに"rss"と入力すると`RSS Feed Trigger`が選択肢に現れるので選択してください。

とりあえずPollタイムをデフォルト値のままにしておきます。

FeedURLは[Lorem RSS](https://lorem-rss.herokuapp.com/)がテストとして使用できます。

Feed URLに以下のURLを設定してください。
- `https://lorem-rss.herokuapp.com/feed?unit=second&interval=30`（30秒間隔でテスト用のFeedを取得できる設定）

![rssTriggerSetting](https://lh3.googleusercontent.com/pw/ABLVV849e17Bgyl3EsHQKBORg3oMgv9jRzFvVMuO9cv1dsxoUpUXwxqBEUWbXhJ94MkyaqGliltudWkGxY5BfTsh9SAZsccskRycff1ra8S5AxqDu7lUAQU-8zS-BnhRurQ5S1dr8IRlBVgh0mYkkAAPVUmnDw=w1776-h976-s-no-gm?authuser=0)

設定できたら`Fetch test Event`ボタンでテスト実行を行います。

画像のようにテスト用のRSS Feedのデータが取得できます。


### クレデンシャルの作成

サイドメニューからCredentialsを選択します。'Add Credential' ボタンで作成モーダルを開きます。
フォームに"nostr"と入力すると"Nostrobots API"がサジェストされるので選択してください。ちなみに表示されない場合はコミュニティノードのインストールが完了していない可能性があります。

![credentialSettingDialog](https://lh3.googleusercontent.com/pw/ABLVV85ftEMMON-lWlqhwo8_4PenFVTwnq54Jpes6TqB0MKjQioKSPk-L31pKnOhotJaTsJwjPAyI4M8xmNgTDEIENdO9m3ufzJZ6nAwMajKwKyAhQvzTnW0y-JMru6ybtlxI8vqEl5CJ1SprGG7pnJZ0E59TA=w1850-h969-s-no-gm?authuser=0)

クレデンシャルの作成画面が開くのでSecretKeyを入力してください。HEXでもbech32(nsecで始まる形式)どちらでも大丈夫です。

ワークフローの作成途中は使い捨て可能なテストアカウントを作成して使用することをおすすめします。

### Nostrへの投稿の実行

RssFeedTriggerノードの右側に出ている"+"をクリックして後に続くノードを追加します。

nostrで検索すると`Nostr Read`と`Nostr Write`の2つのノードが表示されるので`Nostr Write`を選んでください。

![AddNostrNode](https://lh3.googleusercontent.com/pw/ABLVV84PoOXwgHMazmiHsv2lcv6I-t9oWgDPLpxEW7adYzTn5-1LgAoxNB6K8kzGQrz75S5kL9lZ9nlNGjsq5z7tiRqbdCPZFrXUteSv2ytpCdQXmANShBWTHFjdE-gv6BM1-Z0JwDDkxlaw5746Ex-qNZS5Zg=w1417-h976-s-no-gm?authuser=0)

選択肢が表示されたら（どれでもいいですが）`Basic Noteactions`を選ぶとノードが追加されます。

ノードの設定画面が開くので以下のように値を設定します。'Credential to connect with'には先程自分が作成したクレデンシャルを設定します。

設定値は以下です。
- Resource: BasicNote
- Operation: Send
- Content: Hello nostr
- Custom Relay: `wss://nostr.mom`

Custom Relayはテスト用に一つだけに設定しました。デフォルトに戻したい場合、項目のメニューから`Reset Value`を実行してください。

設定が完了したら`Execute node`ボタンをクリックしてノードを実行します。

実行が完了するとOUTPUTに実行結果が表示されます。

![NodeSetting](https://lh3.googleusercontent.com/pw/ABLVV85PZn5a8vt6s1Xyfs5dVkWVrjhiT9X2iVroGbNpNoytYBL5gyvdRF7VkMJm5r8qmbsaO5jNuzqmqPc7QQGjmO9kOLTeixkkkD_xw0fU8sO9D0wZYcl_1xjVnXaLLTbDvxgV-P6EewfErfC_BgRQdcDf1w=w1313-h976-s-no-gm?authuser=0)

`content:Hello nostr`を含むイベントが作成されており、sendResultが`0:[accepted]: wss://nostr.mom`になっていれば成功です。

他のクライアントからも確認できます。（Custom Relayに設定したリレーをクライアントに設定する必要があります）

![testnote1](https://lh3.googleusercontent.com/pw/ABLVV84ufCwONK4o4c7hg9srN_6l9Sk5T1QECId_zMotPBSmnkU8DlJnAp45zCBHFjzrlYvMT7iXSGr9oirPPEmUVBZqA-zZ_00kCtWl3XISsygAsANwvCPtklOWgkJgq6UuH5OhAvPA18sGZbg88axvVoO-Bg=w455-h976-s-no-gm?authuser=0)

### RSSとの接続

INPUTに`RSS Feed Trigger`の結果がSchema形式で表示されていると思います。`A content`という項目をドラッグしてNostr Writeの'Content'のフォームドロップしてください。

これだけで実行済みのノードの結果のデータをコンテントに埋め込んで渡すことができます。

この状態でテスト実行して確かめてみましょう。

![testnote2](https://lh3.googleusercontent.com/pw/ABLVV86JI3nUdpAtG2ed-3zhEZv9YougJr-05HhjokQlHVVttB4iw3ScLmCeqUrwJr8SKITlJGHhXX7DFg-bc36kzCUqdJevgAUqkZGPmMWm0d91S4nWxx5XDfPDxofqvGCfRp3KkXJwBfeUd-tMyg8TPPyiag=w1789-h976-s-no-gm?authuser=0)

RSS Feedの内容を投稿できました。

### 有効化

あと有効化して実行するだけです。

右上の赤い`Save`ボタンをクリックして保存したら、その左の`Inactive`と書かれたトグルボタンを有効化してください。確認モーダルが表示されるので確認して`Got it`を選択します。

以上で完了です。

クライアントから投稿ができているか見てみましょう。

![client](https://lh3.googleusercontent.com/pw/ABLVV86rktosU9AR3WeiCHMXap37taAtUvgf97y4jCeuU_rIpfG5lPEfyFljjmguKJIXqcKy5-uC3EM81L1acHcW_uPDcJd210JLCbglnM8jfjoavb8A539yI84Nss48mDzZOK-cRImKaDxxmntfh6cMc-o-Vw=w454-h976-s-no-gm?authuser=0)

1分ごとに投稿ができており、一度に2投稿できているので成功です！

お疲れ様でした。これでRSS Feedボットの作成完了です。
