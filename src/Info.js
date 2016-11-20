import React, { Component } from 'react'
import weibo from './media/weibo.png'
import douban from './media/douban.png'
import qzone from './media/qzone.png'
import logo from './media/logo.png'

class Share extends Component {
    render() {
        return (
            <a className="share" target="_blank"  title={"分享到" + this.props.siteName} href={this.props.siteUrl}>
                <img className="shareimg" alt={"分享到" + this.props.siteName} src={this.props.siteImg} width="20" height="20" />
            </a>
        )
    }
}
class Shares extends Component {
    render() {
        return(
            <div className="shares">
                <div className="showshare"></div>
                <div className="sharegroup">
                    <Share siteName="新浪微博"
                           siteUrl="http://v.t.sina.com.cn/share/share.php?title=PlaySudoku，无尽的数独谜题，从简单到超难。&url=http://playsudoku.me&source=bookmark"
                           siteImg={weibo}
                    />
                    <Share siteName="豆瓣"
                           siteUrl="http://www.douban.com/recommend/?title=PlaySudoku，无尽的数独谜题，从简单到超难。&url=http://playsudoku.me&source=bookmark"
                           siteImg={douban}
                    />
                    <Share siteName="QQ空间"
                           siteUrl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=PlaySudoku，无尽的数独谜题，从简单到超难。&url=http://playsudoku.me"
                           siteImg={qzone}
                    />
                </div>
            </div>
        )
    }
}
class About extends Component {
    render() {
        return(
            <div className="about">
                <div className="showabout"></div>
                <div className="aboutme">
                    <img className="aboutlogo" src={logo} alt="logo" />
                    <hr/>
                    <h3>关于PlaySudoku</h3>
                    <p>PlaySudoku 是一个完全由 JavaScript(React) 开发的数独游戏，你可以将其保存为书签，使用各种设备随时打开网页即可进行解谜。</p>
                    <h3>有多少谜题？</h3>
                    <p>PlaySudoku每个难度下可以生成数以亿计的不同开局，永远不用担心会遇到同样的开局。</p>
                    <h3>怎么玩？</h3>
                    <ol className="playhelp">
                        <li>点击空白块，再点击下方数字进行填写。</li>
                        <li>直接点击下方数字，查看该数字的分布情况。</li>
                        <li><span id="bt1">点击</span>按钮显示选中方块的可能值。<span id="bt2">点击</span>按钮获得选中方块的确定值（共三次机会）。</li>
                        <li><span id="bt3">点击</span>按钮删除输入，<span id="bt4">点击</span>按钮查看答案结束解谜。</li>
                    </ol>
                    <h3>如果你有任何问题</h3>
                    <p>请给我发邮件: liyancsu@gmail.com</p>
                    <hr/>
                    <p>PlaySudoku Designed and Developed by @LiYan。</p>
                </div>
            </div>
        )
    }
}
class Info extends Component {
    render() {
        return (
            <div className="info">
                <Shares />
                <About />
                <a className="code"  target="_blank" title="查看源代码" href="https://github.com/clumsyme/PlaySudoku"></a>
            </div>
        )
    }
}
export default Info
