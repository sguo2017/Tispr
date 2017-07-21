import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    PixelRatio,
    Alert,
    ScrollView,
} from 'react-native'
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../components/HomeNavigation';
import SignUp from '../pages/signup';

@observer
export default class UserAgreement extends Component {

    constructor(props) {
        super(props);

    }
  
    render() {
        return (
            <View style={{ flex: 1, backgroundColor:'#fff'}}>
                <Header 
                    leftIcon = {require('../resource/ic_back_white.png')}
                    leftIconAction = {()=>this.props.navigator.pop()}
                    title='用户协议'
                />
                <ScrollView style={{paddingHorizontal: 12}} >
                    <Text style={{fontSize: 20, color: '#000', paddingTop: 12}}>奇客用户服务协议</Text>
                    <View style={{height: 2, backgroundColor: 'rgba(237,237,237,1)', marginVertical: 16}}></View>
                    <Text style={{fontSize: 16, color: global.gColors.themeColor, marginBottom: 16}} >特别申明</Text>
                    <Text style={styles.text}>亲爱的用户，您好! 欢迎使用奇客网（www.qikework.com）及奇客APP产品服务（以下统称“本平台”）。本平台依据《“奇客”用户服务协议》（以下简称“本协议”）的规定提供服务，而您作为本平台的使用者（下称“用户”）在使用奇客网（www.qikework.com）或奇客APP服务前，必须事先仔细阅读《“奇客”用户服务协议》的全部内容，尤其是涉及您重大权益的加粗部分的文字。
    若您已经注册为本平台用户，即表示您已充分阅读、理解并同意自己与本平台订立本协议，且您自愿受本协议的条款约束。本平台有权随时变更本协议并在本平台上予以公告。经修订的条款一经在本平台的公布后，立即自动生效。如您不同意相关变更，必须停止使用本平台。本协议内容包括协议正文及所有奇客网平台已经发布的各类规则。所有规则为本协议不可分割的一部分，与本协议正文具有同等法律效力。一旦您继续使用本平台，则表示您已接受并自愿遵守经修订后的条款。
                    </Text>
                    <Text style={styles.title} >第一条　用户资格</Text>
                    <Text style={styles.text}>1、只有符合下列条件之一的自然人或法人才能申请成为本平台用户，可以使用本平台的服务：</Text>
                    <Text style={styles.text}>A、年满十八岁，并具有民事权利能力和民事行为能力的自然人；</Text>
                    <Text style={styles.text}>B、无民事行为能力人或限制民事行为能力人应经过其监护人的同意；</Text>
                    <Text style={styles.text}>C、根据中国法律、法规、行政规章成立并合法存在的机关、企事业单位、社团组织和其他组织。无法人资格的单位或组织不当注册为本平台用户的，其与本平台之间的协议自始无效，本平台一经发现，有权立即终止对该用户的服务，并追究其使用本平台服务的一切法律责任。</Text>
                    <Text style={styles.text}>2、用户需要提供明确的联系地址和联系电话，认证用户需要并提供真实姓名或企业名称。</Text>
                    <Text style={styles.text}>3、本平台用户须承诺遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性。</Text>
                    <Text style={styles.title} >第二条　用户的权利和义务</Text>
                    <Text style={styles.text}>1、用户有权根据本协议及本平台发布的相关规则，利用本平台发布需求信息、查询用户信息、参与需求投标，在本平台社区及相关产品发布信息，参加本平台的有关活动及有权享受本平台提供的其他有关资讯及信息服务。</Text>
                    <Text style={styles.text}>2、用户须自行负责自己的用户账号和密码，且须对在用户账号密码下发生的所有活动（包括但不限于发布需求信息、网上点击同意各类协议、规则、参与需求投标等）承担责任。用户有权根据需要更改登录密码。因用户的过错导致的任何损失由用户自行承担，该过错包括但不限于：不按照交易提示操作，未及时进行交易操作，遗忘或泄漏密码，密码被他人破解，用户使用的计算机被他人侵入。 </Text>
                    <Text style={styles.text}>3、用户应当向本平台提供真实准确的注册信息，包括但不限于真实姓名、身份证号、联系电话、地址、邮政编码等。保证本平台可以通过上述联系方式与自己进行联系。同时，用户也应当在相关资料实际变更时及时更新有关注册资料。</Text>
                    <Text style={styles.text}>4、用户在本平台注册的账号名称，不得有下列情形：</Text>
                    <Text style={styles.text}>（1）违反宪法或法律法规规定的；</Text>
                    <Text style={styles.text}>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</Text>
                    <Text style={styles.text}>（3）损害国家荣誉和利益的，损害公共利益的；</Text>
                    <Text style={styles.text}>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</Text>
                    <Text style={styles.text}>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
                    <Text style={styles.text}>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</Text>
                    <Text style={styles.text}>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</Text>
                    <Text style={styles.text}>（8）侮辱或者诽谤他人，侵害他人合法权益的；</Text>
                    <Text style={styles.text}>（9）含有法律、行政法规禁止的其他内容的。</Text>
                    <Text style={styles.text}>5、用户不得以虚假信息骗取账号名称注册，或其账号头像、简介等注册信息存在违法和不良信息。</Text>
                    <Text style={styles.text}>6、用户不得冒用、关联机构或社会名人注册账号名称。</Text>
                    <Text style={styles.text}>7、用户不得以任何形式擅自转让或授权他人使用自己在本平台的用户帐号（实名认证通过后，不能进行变更）。</Text>
                    <Text style={styles.text}>8、用户有义务确保在本平台上发布的需求信息真实、准确，无误导性。　</Text>
                    <Text style={styles.text}>9、用户在本平台上发布需求及相关服务信息，不得违反国家法律、法规、行政规章的规定，不得侵犯他人知识产权或其他合法权益的信息，不得违背社会公共利益或公共道德，不得违反奇客网的相关规定。</Text>
                    <Text style={styles.text}>10、用户在本平台交易中应当遵守诚实信用原则，不得以干预或操纵发布需求等不正当竞争方式扰乱网上交易秩序，不得从事与网上交易无关的不当行为。</Text>
                    <Text style={styles.text}>11、用户不应采取不正当手段（包括但不限于虚假需求、互换好评等方式）提高自身或他人信用度，或采用不正当手段恶意评价其他用户，降低其他用户信用度。</Text>
                    <Text style={styles.text}>12、用户承诺自己在使用本平台实施的所有行为遵守法律、法规、行政规章和本平台的相关规定以及各种社会公共利益或公共道德。如有违反导致任何法律后果的发生，用户将以自己的名义独立承担相应的法律责任。</Text>
                    <Text style={styles.text}>13、用户在本平台网上交易过程中如与其他用户因交易产生纠纷，可以请求本平台从中予以协调处理。用户如发现其他用户有违法或违反本协议的行为，可以向本平台举报。</Text>
                    <Text style={styles.text}>14、除奇客网另有规定外，用户应当自行承担因交易产生的相关费用，并依法纳税。</Text>
                    <Text style={styles.text}>15、未经本平台书面允许，用户不得将本平台的任何资料以及在交易平台上所展示的任何信息作商业性利用（包括但不限于以复制、修改、翻译等形式制作衍生作品、分发或公开展示）。　</Text>
                    <Text style={styles.text}>16、用户不得使用以下方式登录网站或破坏网站所提供的服务：</Text>
                    <Text style={styles.text}>A、以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其它自动方式访问或登录本平台；</Text>
                    <Text style={styles.text}>B、通过任何方式对本公司内部结构造成或可能造成不合理或不合比例的重大负荷的行为；</Text>
                    <Text style={styles.text}>C、通过任何方式干扰或试图干扰网站的正常工作或网站上进行的任何活动。 </Text>
                    <Text style={styles.text}>17、用户同意接收来自本平台的信息，包括但不限于活动信息、交易信息、促销信息等。</Text>
                    <Text style={styles.title}>第三条　奇客平台的权利和义务</Text>
                    <Text style={styles.text}>1、本平台仅为用户提供一个信息交流平台，是雇主发布需求和奇客er提供解决方案的一个交易市场，本平台对交易双方均不加以监视或控制，亦不主动介入交易的过程。</Text>
                    <Text style={styles.text}>2、本平台有义务在现有技术水平的基础上努力确保整个网上交流平台的正常运行，尽力避免服务中断或将中断时间限制在最短时间内，保证用户网上交流活动的顺利进行。</Text>
                    <Text style={styles.text}>3、本平台有义务对用户在注册使用本平台中所遇到的与交易或注册有关的问题及反映的情况及时作出回复。</Text>
                    <Text style={styles.text}>4、本平台有权对用户的注册资料进行审查，对存在任何问题或怀疑的注册资料，本平台有权发出通知询问用户并要求用户做出解释、改正。</Text>
                    <Text style={styles.text}>5、用户因在本平台网上交易与其他用户产生纠纷的，用户将纠纷告知本平台，或本平台知悉纠纷情况的，经审核后，本平台有权通过电子邮件及电话联系向纠纷双方了解纠纷情况，并将所了解的情况通过电子邮件互相通知对方；用户通过司法机关依照法定程序要求本平台提供相关资料，本平台将积极配合并提供有关资料。</Text>
                    <Text style={styles.text}>6、因网上信息平台的特殊性，本平台不承担对所有用户的交易行为以及与交易有关的其他事项进行事先审查的义务，但如发生以下情形，本平台有权无需征得用户的同意限制用户的活动、向用户核实有关资料、发出警告通知、暂时中止、无限期中止及拒绝向该用户提供服务： </Text>
                    <Text style={styles.text}>A、用户以非自然人名义进行认证之后认证主体自行注销或者经有权机关吊销或撤销的；</Text>
                    <Text style={styles.text}>B、用户违反本协议或因被提及而纳入本协议的相关规则；</Text>
                    <Text style={styles.text}>C、存在用户或其他第三方通知本平台，认为某个用户或具体交易事项存在违法或不当行为，并提供相关证据，而本平台无法联系到该用户核证或验证该用户向本平台提供的任何资料；</Text>
                    <Text style={styles.text}>D、存在用户或其他第三方通知本平台，认为某个用户或具体交易事项存在违法或不当行为，并提供相关证据。本平台以普通非专业人员的知识水平标准对相关内容进行判别，可以明显认为这些内容或行为可能对他方或本平台造成财务损失或承担法律责任。 </Text>
                    <Text style={styles.text}>7、根据国家法律、法规、行政规章规定、本协议的内容和本平台所掌握的事实依据，可以认定该用户存在违法或违反本协议行为以及在本平台交易平台上的其他不当行为，本平台有权无需征得用户的同意在本平台交易平台及所在网站上以网络发布形式公布该用户的违法行为，并有权随时作出删除相关信息、终止服务提供等处理。 </Text>
                    <Text style={styles.text}>8、本平台有权在不通知用户的前提下，删除或采取其他限制性措施处理下列信息：包括但不限于以规避费用为目的；以炒作信用为目的；存在欺诈等恶意或虚假内容；与网上交易无关或不是以交易为目的；存在恶意竞价或其他试图扰乱正常交易秩序因素；违反公共利益或可能严重损害本平台和其他用户合法利益。 </Text>
                    <Text style={styles.title}>第四条　服务的中断和终止</Text>
                    <Text style={styles.text}>1、本平台可自行全权决定以任何理由(包括但不限于本平台认为用户已违反本协议及相关规则的字面意义和精神，或用户在超过180日内未登录本平台等)终止对用户的服务，并有权在两年内保存用户在本平台的全部资料（包括但不限于用户信息、产品信息、交易信息等）。同时本平台可自行全权决定，在发出通知或不发出通知的情况下，随时停止提供全部或部分服务。服务终止后，本平台没有义务为用户保留原账户中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给用户或第三方。</Text>
                    <Text style={styles.text}>2、若用户申请终止本平台服务，需经本平台审核同意，方可解除与本平台的协议关系，但本平台仍保留下列权利： </Text>
                    <Text style={styles.text}>A、本平台有权在法律、法规、行政规章规定的时间内保留该用户的资料，包括但不限于以前的用户资料、交易记录等； </Text>
                    <Text style={styles.text}>B、若终止服务之前，该用户在本平台交易平台上存在违法行为或违反本协议的行为，本平台仍可行使本协议所规定的权利。 </Text>
                    <Text style={styles.text}>3、用户存在下列情况，本平台可以终止向该用户提供服务： </Text>
                    <Text style={styles.text}>A、在用户违反本协议及相关规则规定时，本平台有权终止向该用户提供服务。本平台将在中断服务时通知用户。但该用户在被本平台终止提供服务后，再一次直接或间接或以他人名义注册为本平台用户的，本平台有权再次单方面终止为该用户提供服务； </Text>
                    <Text style={styles.text}>B、本平台发现用户注册资料中主要内容是虚假的，本平台有权随时终止为该用户提供服务； </Text>
                    <Text style={styles.text}>C、本协议终止或更新时，用户未确认新的协议的； </Text>
                    <Text style={styles.text}>D、其它本平台认为需终止服务的情况。</Text>
                    <Text style={styles.title}>第五条　本平台的责任范围 </Text>
                    <Text style={styles.text}>当用户接受该协议时，用户应当明确了解并同意： </Text>
                    <Text style={styles.text}>1、本平台不能随时预见到任何技术上的问题或其他困难。该等困难可能会导致数据损失或其他服务中断。本平台是在现有技术基础上提供的服务。本平台不保证以下事项： </Text>
                    <Text style={styles.text}>A、本平台将符合所有用户的要求； </Text>
                    <Text style={styles.text}>B、本平台不受干扰、能够及时提供、安全可靠或免于出错； </Text>
                    <Text style={styles.text}>C、本服务使用权的取得结果是正确或可靠的。 </Text>
                    <Text style={styles.text}>2、是否经由本平台下载或取得任何资料，由用户自行考虑、衡量并且自负风险，因下载任何资料而导致用户电脑系统的任何损坏或资料流失，用户应负完全责任。希望用户在使用本平台时，小心谨慎并运用常识。 </Text>
                    <Text style={styles.text}>3、用户经由本平台取得的建议和资讯，无论其形式或表现，绝不构成本协议未明示规定的任何保证。 </Text>
                    <Text style={styles.text}>4、基于以下原因而造成的利润、商誉、使用、资料损失或其它无形损失，本平台不承担任何直接、间接、附带、特别、衍生性或惩罚性赔偿（即使本平台已被告知前款赔偿的可能性）： </Text>
                    <Text style={styles.text}>A、本平台的使用或无法使用； </Text>
                    <Text style={styles.text}>B、用户的传输或资料遭到未获授权的存取或变更；</Text>
                    <Text style={styles.text}>C、本平台中任何第三方之声明或行为； </Text>
                    <Text style={styles.text}>D、本平台在服务交易中为用户提供交易机会，推荐交易方； </Text>
                    <Text style={styles.text}>E、本平台其它相关事宜。 </Text>
                    <Text style={styles.text}>5、本平台只是为用户提供一个服务交易的平台，对于用户所发布的需求的合法性、真实性及其品质，以及用户履行交易的能力等，本平台一律不负任何担保责任。 </Text>
                    <Text style={styles.text}>6、本平台提供与其它互联网上的网站或资源的链接，用户可能会因此连结至其它运营商经营的网站，但不表示本平台与这些运营商有任何关系。其它运营商经营的网站均由各经营者自行负责，不属于本平台控制及负责范围之内。对于存在或来源于此类网站或资源的任何内容、广告、物品或其它资料，本平台亦不予保证或负责。因使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、物品或服务所产生的任何损害或损失，本平台不负任何直接或间接的责任。 </Text>
                    <Text style={styles.title}>第五条　本平台的责任范围 </Text>
                    <Text style={styles.text}>第六条　知识产权 </Text>
                    <Text style={styles.text}>1、本平台及本平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、图形、音频、视频、档案、资料、网站构架、网站版面的安排、网页设计、经由本平台或广告商向用户呈现的广告或资讯，均由本平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经本平台或权利人明示授权，用户保证不修改、出租、出借、出售、散布本平台及本平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。  </Text>
                    <Text style={styles.text}>2、本平台授予用户不可转移及非专属的使用权，使用户可以通过单机计算机使用本平台的目标代码（以下简称“软件”），但用户不得且不得允许任何第三方复制、修改、创作衍生作品、进行还原工程、反向组译，或以其它方式破译或试图破译源代码，或出售、转让“软件”或对“软件”进行再授权，或以其它方式移转“软件”之任何权利。用户同意不以任何方式修改“软件”，或使用修改后的“软件”。 </Text>
                    <Text style={styles.text}>3、用户不得经由非本平台所提供的界面使用本平台。  </Text>
                    <Text style={styles.text}>第七条　隐私权  </Text>
                    <Text style={styles.text}>1、信息使用  </Text>
                    <Text style={styles.text}>A、本平台不会向任何人出售或出借用户的个人或法人信息，除非事先得到用户得许可；  </Text>
                    <Text style={styles.text}>B、本平台亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人或法人信息。任何用户如从事上述活动，一经发现，本平台有权立即终止与该用户的服务协议，查封其账号。 </Text>
                    <Text style={styles.text}>C、用户通过奇客网及奇客APP端，或通过微信等第三方平台账号（下称“第三方平台”）注册、登陆、使用奇客网服务，将被视为用户完全了解、同意并接受本平台已包括但不限于收集、统计、分析等方式使用其在本平台上填写、登记、公布、记录的全部信息（下称“第三方平台记录信息”）。用户一旦进行账号注册、登陆、使用奇客服务等行为，均将被视为已经获得了用户本人的完全同意并接受本平台对于该信息的合法使用，该信息的使用权适用于奇客网及奇客APP下所有产品。本平台使用用户信息的目的在于为用户提供更好的产品体验及个人职业发展；本平台使用用户信息的方式包括但不限于：收集、统计、分析、商业用途的使用等方式。 </Text>
                    <Text style={styles.text}>2、信息披露  </Text>
                    <Text style={styles.text}>用户的个人或法人信息将在下述情况下部分或全部被披露：  </Text>
                    <Text style={styles.text}>A、经用户同意，向第三方披露；  </Text>
                    <Text style={styles.text}>B、用户在使用本平台过程中涉及到知识产权类纠纷，有他方主张权利的，本平台在审核主张方提交的资料后认为披露用户信息有助于纠纷解决的；  </Text>
                    <Text style={styles.text}>C、根据法律的有关规定，或者行政、司法机关的要求，向第三方或者行政、司法机关披露；  </Text>
                    <Text style={styles.text}>D、若用户出现违反中国有关法律或者网站规定的情况，需要向第三方披露；  </Text>
                    <Text style={styles.text}>E、为提供你所要求的产品和服务，而必须和第三方分享用户的个人或法人信息；  </Text>
                    <Text style={styles.text}>F、为保护您、我们的其他用户或我们的关联方的合法权益，我们可能将您的个人信息用于预防、发现、调查以下事项：欺诈、危害安全、违法或违反与我们或其关联方协议、政策或规则的行为；   </Text>
                    <Text style={styles.text}>G、在遵循隐私权保护以及其他相应的保密安全措施的前提下，允许我们将您的个人信息提供给相关合作方，让其根据我方指令处理相关信息；   </Text>
                    <Text style={styles.text}>H、其它本平台根据法律或者网站规定认为合适的披露。   </Text>
                    <Text style={styles.text}>若您不同意以上内容，请立即停止使用奇客网及奇客APP等本平台相关的服务。 
用户或者第三方申请本平台披露其他用户信息的，本平台有权视实际情况要求申请人出具申请书，申请书内容应包含申请披露的信息范围、用途及使用承诺等内容。 
  </Text>
                    <Text style={styles.text}>3、信息安全   </Text>
                    <Text style={styles.text}>A、在使用本平台服务进行网上交易时，请用户妥善保护自己的个人或法人信息，仅在必要的情形下向他人提供；   </Text>
                    <Text style={styles.text}>B、如果用户发现自己的个人或法人信息泄密，尤其是用户账户及密码发生泄露，请用户立即联络本平台客服，以便我们采取相应措施。   </Text>
                    <Text style={styles.text}>第八条　不可抗力   </Text>
                    <Text style={styles.text}>因不可抗力或者其他意外事件，使得本协议的履行不可能、不必要或者无意义的，双方均不承担责任。本合同所称之不可抗力意指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定疾病、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。  </Text>
                    <Text style={styles.text}>第九条　保密 </Text>
                    <Text style={styles.text}>用户保证在使用本平台过程中所获悉的属于奇客网及他方的且无法自公开渠道获得的文件及资料（包括但不限于商业秘密、公司计划、运营活动、财务信息、技术信息、经营信息及其他商业秘密）予以保密。未经该资料和文件的原提供方同意，用户不得向第三方泄露该商业秘密的全部或者部分内容。但法律、法规、行政规章另有规定或者双方另有约定的除外。   </Text>
                    <Text style={styles.text}>第十条　交易纠纷解决方式  </Text>
                    <Text style={styles.text}>1、本协议及其规则的有效性、履行和与本协议及其规则效力有关的所有事宜，将受中华人民共和国法律管辖，任何争议仅适用中华人民共和国法律。   </Text>
                    <Text style={styles.text}>2、本平台有权受理并调处您与其他用户因交易服务产生的纠纷，同时有权单方面独立判断其他用户对您的举报及索偿是否成立。本平台没有使用自用资金进行偿付的义务，但若进行了该等支付，您应及时赔偿本平台的全部损失。因本平台非司法机关，您完全理解并承认，本平台对证据的鉴别能力及对纠纷的处理能力有限，受理交易纠纷完全是基于您之委托，不保证处理结果符合您的期望，本平台有权决定是否参与争议的调处。  </Text>
                    <Text style={styles.text}>3、凡因履行本协议及其规则发生的纠纷以及在奇客网上交易产生的所有纠纷，各方可协商解决，若协商不成的，各方一致同意提交北京仲裁委员会按其仲裁规则进行仲裁。    </Text>
                    <Text style={styles.text}>第十一条　其它 </Text>
                    <Text style={styles.text}>1、本平台对本服务协议包括基于本服务协议制定的各项规则拥有最终解释权。   </Text>
                    <Text style={styles.text}>2、用户与本平台的任何纠纷，可以通过协商的途径解决。协商不成的，任何一方可向本网站登记住所地的人民法院提起诉讼。   </Text>
                    <Text style={styles.text}>第十二条　附则 </Text>
                    <Text style={styles.text}>在本协议中所使用的下列词语，除非另有定义，应具有以下含义：    </Text>
                    <Text style={styles.text}>“本平台”在无特别说明的情况下，均指"奇客网"（www.qikework.com,奇客APP个人客户端 ）。   </Text>
                    <Text style={styles.text}>“用户”：指完成奇客平台注册程序，获得可以登陆奇客平台会员系统权限的正式注册会员。   </Text>
                    <Text style={styles.text}>“雇主”：是指在奇客平台上进行发布需求、购买服务、发起购买服务、雇佣等操作的用户。   </Text>
                    <Text style={styles.text}>“交易”：是指雇主和服务方双方使用奇客平台提供的交易方式作为付款方式达成交易的行为。   </Text>
                    <Text style={styles.text}>“服务”：指服务提供者通过奇客平台发布自身技能或服务售卖信息，用户通过奇客平台提出购买意向，并获取服务的商业活动。   </Text>
                    <Text style={styles.text}>“发布服务”：用户通过奇客平台将自身可以提供的技能或服务信息展示出来。   </Text>
                    <Text style={styles.text}>“奇客er”：即服务提供者，指通过奇客平台发布技能售卖信息，向用户提供服务的自然人、法人或其他组织。   </Text>
                    <Text style={styles.text}>“雇佣”：指由雇主直接对服务提供者发起的交易模式。   </Text>
                    <Text style={styles.text}>“通知”：奇客平台中，系统消息、用户工作消息、用户服务交易消息的分类集合管理。   </Text>
                    <Text style={styles.text}>“消息”：奇客平台中，平台与用户、用户与用户进行私信往来的重要渠道。   </Text>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: "#000",
        fontSize:16
    },
    title: {
        fontSize: 16,
        color: global.gColors.themeColor,
        marginVertical: 10
    }
})