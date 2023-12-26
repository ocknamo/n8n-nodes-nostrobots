# Tutorial: Creating an RSS Feed Bot

Let's create a bot that posts RSS Feed to Nostr using `n8n-nodes-nostrobots`.

## Background

### What is n8n?

It's a no-code tool. It is a workflow automation tool similar to famous no-code tools such as Zapier and IFTTT.

I quote the official explanation.

> n8n - Workflow automation tool
> n8n is an extensible workflow automation tool. With a fair code distribution model, n8n always has source code visible, is self-hosted, and allows you to add your own custom functions, logic, and apps. n8n's node-based approach is highly versatile and allows you to connect anything to anything.
> (machine translation)

https://github.com/n8n-io/n8n

Workflow components that can be used in combination in n8n are called "node".


### What is a community node?

It is a node that anyone can freely create and share with everyone. It can be created with Node.js.

Click here to see how to create it.
- https://docs.n8n.io/integrations/creating-nodes/

It's not that difficult since there are templates and tutorials. This time I will not introduce how to create it.

This `n8n-nodes-nostrobots` was also created as a community node.


## Preparation

### Preparation for n8n

The code for n8n is publicly available and self-hosting is also possible. The easiest way to use it is to pay or self-host.

#### Pay

It looks like you can use the platform for 20 euros a month.

https://n8n.io/pricing/

#### Self-hosted

If you are an programmer who can use Docker or Node.js, you can easily self-host it.

https://docs.n8n.io/hosting/

Also, if you are using Umbrel, the app is available in the store and can be installed with one click.

https://apps.umbrel.com/app/n8n

![umbrelAppStore](https://lh3.googleusercontent.com/pw/ABLVV843Y0nvCrczIm9ZdL6wnJ7uMnMBpkN9LANMHUH1cPwSTMKs5uMizBOQtJF0LwFxv3omO09-tqRvyzvz4KAIkKtlTwILHZR-S6cSvpeSHu_Yj9nqM4jZt1lIWef5TRap0hsoMUUeFGkdKMhNMYUvqI7UBw=w1850-h969-s-no-gm?authuser=0)

### How to install community nodes

There are risks when using community nodes, so be sure to read the official documentation and install at your own risk.

https://docs.n8n.io/integrations/community-nodes/

I will explain how to install n8n-nodes-nostrobots.

Move `Community nodes` to the page from `Settings` in the side menu and install it.

![installDialog](https://lh3.googleusercontent.com/pw/ABLVV8664ZzIcTW8M5-9edEOagk88He5k21cLX7147qlJfJTQFTPtDsZ69hGt0FRsIaBcbPImZu6YP4LbNYARMgyIimoyrqGonS23Bw4-tAWsM7u68QlrgZptZWVjoIWy62azcZlS-35nwK97093IEEIPbQGwA=w1776-h976-s-no-gm?authuser=0)

Enter `n8n-nodes-nostrobots` in npm Package Name and run the installation.

After waiting for a while, it will be added to the `Community nodes` list, so the installation is complete.

![installed](https://lh3.googleusercontent.com/pw/ABLVV872ffdY-2-uw-e9_hUdld20TmS_sV1G9V5iFOEoFAYs9ZWcoUIlwyKGY8fGY7SEju-DwTDv9ORpvSRF5cweztWrhK9wLt-yRjQlKvoAu8lVzuQQTwvbhVFKqN8KLc0N-fgp4UDnwGVa6kCO8hvGD8xmgQ=w1776-h976-s-no-gm?authuser=0)


### Installing other nodes

Install the community node `n8n-nodes-rss-feed-trigger` as described above.

https://github.com/joffcom/n8n-nodes-rss-feed-trigger

I have briefly checked the code, but please use the specifications at your own risk.


## Workflow creation

You can add a workflow from `Add Workflow` on the Workflows screen.

![emptyWorkflow](https://lh3.googleusercontent.com/pw/ABLVV86PfZXJJhuXrcCY3l9ZbBhVK6o8eJ18cn6aGUGqlC23POW687RZzxm3UD66DtmkPOd0lp92nxicZ1DtX1UsHC_gpkYn0p25_we86h89rxX0ofYGNwQJ7h14tj5ss-BUNrAbrqwZwAtdbhA8BjMKLKyt5g=w1776-h976-s-no-gm?authuser=0)


### Creating a trigger node

First, set the trigger node. (Trigger nodes are not implemented in n8n-nodes-nostrobots yet)
Click "+" to open additional menu.

We want to use `n8n-nodes-rss-feed-trigger` as the trigger node, so enter "rss" in the search form and `RSS Feed Trigger` will appear as an option, so select it.

For now, leave the Poll time at its default value.

FeedURL can be used as a test by [Lorem RSS](https://lorem-rss.herokuapp.com/).

Please set the following URL to the Feed URL.
- `https://lorem-rss.herokuapp.com/feed?unit=second&interval=30` (Settings that allow you to obtain test feed at 30 second intervals)

![rssTriggerSetting](https://lh3.googleusercontent.com/pw/ABLVV849e17Bgyl3EsHQKBORg3oMgv9jRzFvVMuO9cv1dsxoUpUXwxqBEUWbXhJ94MkyaqGliltudWkGxY5BfTsh9SAZsccskRycff1ra8S5AxqDu7lUAQU-8zS-BnhRurQ5S1dr8IRlBVgh0mYkkAAPVUmnDw=w1776-h976-s-no-gm?authuser=0)

Once the settings are complete, run the test using the `Fetch test Event` button.

You can get RSS Feed data for testing as shown in the image.


### Create credentials

Select Credentials from the side menu. The 'Add Credential' button opens the creation modal.
When you enter "nostr" in the form, "Nostrobots API" will be suggested, so please select it. By the way, if it is not displayed, the installation of the community node may not be completed.

![credentialSettingDialog](https://lh3.googleusercontent.com/pw/ABLVV85ftEMMON-lWlqhwo8_4PenFVTwnq54Jpes6TqB0MKjQioKSPk-L31pKnOhotJaTsJwjPAyI4M8xmNgTDEIENdO9m3ufzJZ6nAwMajKwKyAhQvzTnW0y-JMru6ybtlxI8vqEl5CJ1SprGG7pnJZ0E59TA=w1850-h969-s-no-gm?authuser=0)

The credential creation screen will open, so enter the SecretKey. Either HEX or bech32 (format starting with nsec) is fine.

We recommend that you create and use a disposable test account while you are creating your workflow.

### Executing a post to Nostr

Click the "+" on the right side of the RssFeedTrigger node to add subsequent nodes.

If you search for nostr, two nodes will be displayed: `Nostr Read` and `Nostr Write`, so select `Nostr Write`.

![AddNostrNode](https://lh3.googleusercontent.com/pw/ABLVV84PoOXwgHMazmiHsv2lcv6I-t9oWgDPLpxEW7adYzTn5-1LgAoxNB6K8kzGQrz75S5kL9lZ9nlNGjsq5z7tiRqbdCPZFrXUteSv2ytpCdQXmANShBWTHFjdE-gv6BM1-Z0JwDDkxlaw5746Ex-qNZS5Zg=w1417-h976-s-no-gm?authuser=0)

When the options are displayed, select `Basic Noteactions` (any one is ok) and the node will be added.

The node settings screen will open, so set the values as shown below. For 'Credential to connect with', set the credentials you created earlier.

The setting values are as follows.
- Resource: BasicNote
- Operation: Send
- Content: Hello nostr
- Custom Relay: `wss://nostr.mom`

I set only one Custom Relay for testing. If you want to return to the default, execute `Reset Value` from the item's menu.

Once the settings are complete, click the `Execute node` button to run the node.

When execution is complete, the execution result will be displayed in OUTPUT.

![NodeSetting](https://lh3.googleusercontent.com/pw/ABLVV85PZn5a8vt6s1Xyfs5dVkWVrjhiT9X2iVroGbNpNoytYBL5gyvdRF7VkMJm5r8qmbsaO5jNuzqmqPc7QQGjmO9kOLTeixkkkD_xw0fU8sO9D0wZYcl_1xjVnXaLLTbDvxgV-P6EewfErfC_BgRQdcDf1w=w1313-h976-s-no-gm?authuser=0)

It is successful if an event containing `content:Hello nostr` is created and the sendResult is `0:[accepted]: wss://nostr.mom`.

You can also check it from other clients. (The relay set as Custom Relay must be set on the client)

![testnote1](https://lh3.googleusercontent.com/pw/ABLVV84ufCwONK4o4c7hg9srN_6l9Sk5T1QECId_zMotPBSmnkU8DlJnAp45zCBHFjzrlYvMT7iXSGr9oirPPEmUVBZqA-zZ_00kCtWl3XISsygAsANwvCPtklOWgkJgq6UuH5OhAvPA18sGZbg88axvVoO-Bg=w455-h976-s-no-gm?authuser=0)

### Connection with RSS

The result of `RSS Feed Trigger` will be displayed in Schema format in INPUT. Drag the item `A content` and drop it on the 'Content' form of Nostr Write.

This is all you need to do to pass the data of the results of the executed nodes embedded in the content.

Let's run a test in this state and check.

![testnote2](https://lh3.googleusercontent.com/pw/ABLVV86JI3nUdpAtG2ed-3zhEZv9YougJr-05HhjokQlHVVttB4iw3ScLmCeqUrwJr8SKITlJGHhXX7DFg-bc36kzCUqdJevgAUqkZGPmMWm0d91S4nWxx5XDfPDxofqvGCfRp3KkXJwBfeUd-tMyg8TPPyiag=w1789-h976-s-no-gm?authuser=0)

The contents of the RSS Feed have been posted.

### Activation

Just enable it and run it.

Click the red `Save` button in the top right corner to save, then enable the toggle button to the left labeled `Inactive`. A confirmation modal will appear, so confirm and select `Got it`.

that's all.

Let's see if the client is able to post.

![client](https://lh3.googleusercontent.com/pw/ABLVV86rktosU9AR3WeiCHMXap37taAtUvgf97y4jCeuU_rIpfG5lPEfyFljjmguKJIXqcKy5-uC3EM81L1acHcW_uPDcJd210JLCbglnM8jfjoavb8A539yI84Nss48mDzZOK-cRImKaDxxmntfh6cMc-o-Vw=w454-h976-s-no-gm?authuser=0)

If you can post every minute, and you can post two at a time, you are successful.

Thank you for your hard work. This completes the creation of the RSS Feed bot.
