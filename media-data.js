/* 自然之境 · 媒体中心数据（2026-08-04 重构为 9 大分类）
 * 图片与视频都安放在「入景」画廊，并作为以下小板块的联动素材源：
 *   沉浸自然(immerse) / 收藏联播(fav) / 拼贴创作(create) / 心流专注(flow) / 心境(mood)
 * 同看一片海(watchsea) 为独立成品，不从此处取素材。
 * 分类（与「入景画廊分类方案」一致）：
 *   一 峡谷丹岩 / 二 云海雪峰 / 三 海岸浪涌 / 四 极光夜幕 /
 *   五 荒野天际 / 六 深林幽径 / 七 天光云影 / 八 水之万象 / 九 影像时光
 * 注：原 px-waves-2(碧浪穿石) 文件损坏已移除，海岸浪涌现仅 1 幅。
 * 音频：全部使用本地真实录音（https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio 下，源自原站 + mixkit CC0），未做任何 AI 合成：
 *   - 画廊浏览：全局 1 首 BGM（music_day.mp3）+ 按分类环境音（amb_*.mp3，每个分类一个真实录音），默认静音、点按钮开启。
 *   - Fav 联播：每图叠各自分类真实环境音（amb_*.mp3）+ 纯音乐（music_day/night）；视频（篝火/雨）保留各自真实录音。
 *     九个分类环境音互不重复；若日后要换，把新素材丢进 https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/ 改 CAT_AMB / AMB 映射即可。
 */
const MEDIA = window.MEDIA_DATA = {
  themes: [
    { id:"canyon", num:"一", name:"峡谷丹岩", tab:"峡谷", desc:"亿万年风蚀水切，赤色岩壁上的时光刻痕", mood:"ember", items:[
      { id:"px-canyon-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-canyon-1.jpg", title:"赤峡蜿蜒", caption:"风用亿万年磨出一把刀，剖开大地赤色的肌理。路是刀痕里漏出的一行诗，还没写完。" },
      { id:"px-canyon-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-canyon-2.jpg", title:"断崖无声", caption:"云压下来，崖不退半步。荒野从不辩解，它只是把辽阔摊开，等风来翻页。" },
      { id:"px-canyon-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-canyon-3.jpg", title:"岩壁鎏金", caption:"夕阳把整面崖壁浇成铜色。原来最硬的石头，也藏着一颗黄昏里变软的心。" },
      { id:"px-canyon-4", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-canyon-4.jpg", title:"河弯如旧", caption:"河流拐了一个几千年没改过的弯。石壁替它记着回声，时间在这里走得很慢很慢。" },
      { id:"px-canyon-5", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-canyon-5.jpg", title:"大地裂缝", caption:"大地裂开一道口子，深到看不见底。但阳光偏偏落了进去，把伤口照成了风景。" }
    ]},
    { id:"clouds", num:"二", name:"云海雪峰", tab:"云海", desc:"云漫山脊，雪顶浮岚，天地之间最安静的时刻", mood:"mist", items:[
      { id:"px-clouds-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-clouds-1.jpg", title:"云上山河", caption:"太阳翻过山脊，把整片云海点燃。山河在金光里浮沉，像一场还没醒的梦。" },
      { id:"px-clouds-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-clouds-2.jpg", title:"林间浮岛", caption:"云海涨上来，松树只露出头顶。像谁在天上种了一排岛，风一吹就漂。" },
      { id:"px-clouds-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-clouds-3.jpg", title:"碧河穿峡", caption:"河水从峡谷中间挤过去，扭出一身青绿色的浪。石头站在两岸看着，几千年没说话。" },
      { id:"px-clouds-4", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-clouds-4.jpg", title:"雪顶浮岚", caption:"雪山踩着云海，天边染了一层淡紫。安静到能听见自己呼出的白雾，像一声叹息。" },
      { id:"px-clouds-5", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-clouds-5.jpg", title:"雪岭云涌", caption:"蓝天很干净，云海在底下翻滚，雪峰时隐时现。你不自觉屏住呼吸，怕惊散了什么。" }
    ]},
    { id:"coast", num:"三", name:"海岸浪涌", tab:"海岸", desc:"海浪与礁石的千年对话，碎玉与碧蓝的交响", mood:"night", items:[
      { id:"px-waves-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/px-waves-1.jpg", title:"碎玉成滩", caption:"浪一头撞在石滩上，碎成满地亮片。大海不嫌烦，千万年来回摔自己，把石头磨得圆圆的。" }
    ]},
    { id:"aurora", num:"四", name:"极光夜幕", tab:"极光", desc:"夜空裂开温柔的光，宇宙最安静的瞬间", mood:"night", items:[
      { id:"aurora", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/aurora.jpg", title:"极光垂幕", caption:"夜空幕布被谁撕开一道口子，光从裂缝里淌下来，绿得不像真的。你仰着头，忘了冷。" }
    ]},
    { id:"wild", num:"五", name:"荒野天际", tab:"荒野", desc:"山脊、高地、地平线，风是唯一的声音", mood:"ember", items:[
      { id:"extreme-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/extreme-1.jpg", title:"荒野之脊", caption:"山脊像一把刀，把天和地切开了。这里没人说话，风替所有人讲了。" },
      { id:"extreme-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/extreme-2.jpg", title:"静默高地", caption:"到了这个高度，连云都懒得走了。人更少，安静到你开始听见自己血管里的声音。" },
      { id:"extreme-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/extreme-3.jpg", title:"苍茫一线", caption:"天和地只隔了一条线，空到能把所有心事倒进去，还填不满。" }
    ]},
    { id:"forest", num:"六", name:"深林幽径", tab:"深林", desc:"林间漏光，小径没入深处，古木无言而立", mood:"mist", items:[
      { id:"forest-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/forest-1.jpg", title:"林间微光", caption:"光从叶缝里挤进来，一小片一小片地落在苔藓上。像谁在林子里撒了一把硬币，没人捡。" },
      { id:"forest-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/forest-2.jpg", title:"林深不知处", caption:"路越走越窄，最后被林子吞掉了。你站在路口犹豫，安静从深处漫过来，拉你进去。" },
      { id:"forest-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/forest-3.jpg", title:"古木无言", caption:"它站了几百年，看过日出日落、暴雨晴天，什么都没说。树皮上的纹路就是它写了一辈子的日记。" },
      { id:"mountain", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/mountain.jpg", title:"远山如黛", caption:"山远远地蹲着，不说话。它只是在那儿，就够提醒你：世界比你的烦恼大得多。" }
    ]},
    { id:"sky", num:"七", name:"天光云影", tab:"天光", desc:"天空的呼吸，云的散步，海天之间的缝合线", mood:"mist", items:[
      { id:"ocean", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/ocean.jpg", title:"海天一线", caption:"海平线是一根针，把天和水缝在了一起。线脚藏得很好，你怎么眯眼都找不到接头。" },
      { id:"sky-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/sky-1.jpg", title:"晴空万里", caption:"天干净到没有一片云。你抬头看了很久，觉得胸口有什么东西被风吹空了，轻得不像话。" },
      { id:"sky-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/sky-2.jpg", title:"流云", caption:"云在天上散步，走得很慢很慢。你看了一会儿，觉得自己也可以不着急了。" },
      { id:"sky-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/sky-3.jpg", title:"天际", caption:"天边洇开一层淡色，像水彩还没干透。世界翻了个身，眼睛还没完全睁开。" }
    ]},
    { id:"water", num:"八", name:"水之万象", tab:"水象", desc:"入海、碧水、静流、溪石、飞瀑——水的五种姿态", mood:"night", items:[
      { id:"splash-hero", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/splash-hero.jpg", title:"雾海崖岸", caption:"雾从海面爬上来，把崖壁吞了一半。对岸的山影影绰绰，像谁用水墨随手抹了一笔，还没干。" },
      { id:"water-1", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/water-1.jpg", title:"碧水如玉", caption:"水绿得发沉，像谁把一块老玉掉进了湖底，再也没捞起来过。" },
      { id:"water-2", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/water-2.jpg", title:"静流", caption:"水流过去没有声音，你盯着看半天才发现它一直在动。安静的东西往往最有耐力。" },
      { id:"water-3", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/water-3.jpg", title:"溪石", caption:"溪水碰见石头，能绕就绕，绕不过就漫过去。水从来不想和谁较劲，它只想往前走。" },
      { id:"waterfall", file:"https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/waterfall.jpg", title:"飞瀑流泉", caption:"水从崖顶翻下来，砸出一身白。站在旁边看久了，觉得时间也跟着一起被倒空了。" }
    ]},
    { id:"video", num:"九", name:"影像时光", tab:"影像", desc:"动态影像——星河、篝火与雨夜，时间被记录下来", mood:"night", items:[
      { id:"stars", file:"https://55101da8d0c94de4a8db022d1c142931.sh4.agentos-app.net/stars.mp4", type:"video", mood:"night", title:"星河低语", caption:"星星一颗接一颗地亮了，像有人轻轻摇了摇夜空。银河慢慢显出来，低声说了句什么，你没听清。" },
      { id:"campfire", file:"https://c1a1834a85e74716ae3bdcac17d2e2a1.bj8.agentos-app.net/campfire.mp4", type:"video", mood:"ember", title:"林间篝火", caption:"火苗一伸一缩地舔着木柴，噼啪声断断续续。你把手伸近了些，连时间都跟着暖了起来。" },
      { id:"rain", file:"https://cee5669dbcff483d9d20188d55f464a8.sh3.agentos-app.net/rain.mp4", type:"video", mood:"night", title:"雨落窗前", caption:"雨打在玻璃上，窗外的树和房子全化开了，像一幅没干的水墨画，还在慢慢淌。" }
    ]}
  ],
  flat(){
    const a=[];
    this.themes.forEach(t=>t.items.forEach(it=>a.push(Object.assign({},it,{theme:t.id,mood:t.mood,type:it.type||'image'}))));
    return a;
  },
  byId(id){ return this.flat().find(x=>x.id===id); }
};
/* 配乐分配（全部指向本地真实录音，非 AI 合成）：
 *   纯音乐按心境 → ember:music_day / mist:music_night / night:music_night
 *   自然声叠加 → 水象/海岸:waves；极光:wind；篝火视频:campfire；雨视频:rain；其余只纯音乐不叠风声。 */
(function(){
  const MUSIC = {
    ember: ['https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/music_day.mp3'],
    mist:  ['https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/music_night.mp3'],
    night: ['https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/music_night.mp3']
  };
  const NAT = { wind:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/wind.mp3', waves:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/waves.mp3',
                campfire:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/campfire.mp3', rain:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/rain.mp3' };
  /* 每个分类一个真实自然录音（与画廊 CAT_AMB 一致，mixkit CC0），Fav 联播时叠在纯音乐上 */
  const AMB = {
    canyon:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_canyon.mp3', clouds:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_clouds.mp3',
    coast:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_coast.mp3',   aurora:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_aurora.mp3',
    wild:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_wild.mp3',     forest:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_forest.mp3',
    sky:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_sky.mp3',       water:'https://cdn.jsdelivr.net/gh/idjdixhdhd/qn-site@main/media/audio/amb_water.mp3'
  };
  const ci = {ember:0, mist:0, night:0};
  MEDIA.themes.forEach(t=>{
    const isVideo = t.id==='video';
    const pool = MUSIC[t.mood] || MUSIC.ember;
    t.items.forEach((it,i)=>{
      it.music = isVideo ? (MUSIC[it.mood]||MUSIC.night)[0] : pool[ci[t.mood] % pool.length];
      if(!isVideo) ci[t.mood]++;
      if(isVideo){
        if(it.id==='campfire') it.audio = NAT.campfire;
        else if(it.id==='rain') it.audio = NAT.rain;
        else it.audio = null;
      } else {
        it.audio = AMB[t.id] || null;   // 非视频分类叠各自真实环境音
      }
    });
  });
})();
