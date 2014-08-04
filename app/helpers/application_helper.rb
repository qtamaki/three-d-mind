# -*- encoding: utf-8 -*-
require 'string_util'
require 'name_util'
require 'type_util'
require 'star_util'
# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  include NameUtil
  include TypeUtil

  def mail_match_target
    DeliveryMail.find(session[:mail_match_target_id]) if session[:mail_match_target_id]
  end

  def or_else(obj, default)
    obj.blank? ? default : obj
  end

  def send_or_else(obj, method, default)
    obj.blank? ? default : (obj.send(method).blank? ? default : obj.send(method))
  end

  def man(amount)
    "#{amount.to_i}万" if amount && amount != 0
  end

  def around_b(str)
    raw "<span style='font-weight:bold'>#{str}</span>"
  end

  def around_b_if(cond, str)
    cond ? around_b(str) : str
  end

  def _date(date)
    if date.blank?
      ""
    elsif date.year == Time.now.year
      date.strftime("%m/%d")
    else
      date.strftime("%Y/%m/%d")
    end
  end

  def _date2(date)
    date && date.strftime("%y/%m/%d")
  end

  def _time(time)
    if time.blank?
      ""
    elsif [ActiveSupport::TimeWithZone, Time, Date].include?(time.class)
      t = time.to_time.getlocal
      if t.today?
        t.strftime("%H:%M")
      elsif t.year == Time.now.year
        t.strftime("%m/%d")
      else
        t.strftime("%Y/%m/%d")
      end
    else
      time
    end
  end

  def _timetoddmmhhmm(time)
    if time.blank?
      ""
    elsif [ActiveSupport::TimeWithZone, Time, Date].include?(time.class)
      t = time.to_time.getlocal
      t.strftime("%m/%d %H:%M")
    else
      time
    end
  end

  def _time_long(time)
    if time.blank?
      ""
    elsif [ActiveSupport::TimeWithZone, Time, Date].include?(time.class)
      time.to_time.getlocal.strftime("%Y/%m/%d %H:%M:%S")
    else
      time
    end
  end

  def _age(age)
    # 「歳」が二重に表示された場合、DBに入ってるデータがおかしい
    # DBに入れる段階で数値（String）のみにしておくこと
    age.blank? ? age :  "#{age}歳"
  end

  def logged_in?
    auth_signed_in?
  end

  def current_user
    current_auth
  end

  def edit?
    ["edit","update"].include?(controller.action_name)
  end

  def currency_field(object_name, method, options = {})
    options[:style] = options[:style].to_s + ";text-align: right;"
    options[:onblur] = "this.value=fnum(this.value);this.style.textAlign='right'"
    options[:onFocus] = "if(this.readOnly==false){this.value=ufnum(this.value);this.style.textAlign='left'}"
    if o = eval("@#{object_name}")
      if val = (o.respond_to?(method) && o.send(method))
        options[:value] = money_format(val.to_i)
      end
    end
    text_field(object_name, method, options)
  end

  def currency_field_tag(name, value = nil, options = {})
    options[:style] = options[:style].to_s + ";text-align: right;"
    options[:onblur] = "this.value=fnum(this.value);this.style.textAlign='right'"
    options[:onFocus] = "if(this.readOnly==false){this.value=ufnum(this.value);this.style.textAlign='left'}"
    text_field_tag(name, money_format(value), options)
  end

  def date_field(object_name, method, options = {})

    options['data-provide'] = "typeahead"
    options['class'] = [options['class'], "date-time-picker"].compact.join(" ")

    result = <<EOS
     <script type="text/javascript">
        // <![CDATA[
        jQuery(function () {
        });
        // ]]>
      </script>
      #{text_field object_name, method, options}
      <script>
        jQuery(function() {
        //テキストボックスにカレンダーをバインドする（パラメータは必要に応じて）
        jQuery("##{object_name}_#{method}").datepicker({
          firstDay: 1,    //週の先頭を月曜日にする（デフォルトは日曜日）
          dateFormat: 'yy/mm/dd',

       //年月をドロップダウンリストから選択できるようにする場合
       changeYear: false,
       changeMonth: false,
EOS

    result += <<EOS
      beforeShow: function(input, inst){
        inst.dpDiv.css({marginTop: 0 + 'px'});
      },

EOS

    result += <<EOS
           });
         });
       </script>
EOS
    return raw result;
  end

  def datetime_field(object_name, method, options = {})
    value = instance_variable_get("@#{object_name}").send(method)
    time_str = value && (value.is_a?(DateTime)||value.is_a?(Time)) && value.strftime('%H:%M') || ''
    date_field(object_name, method, options) + " " + text_field_tag("#{object_name}_#{method}_time", time_str, :size => 10)
  end

  def date_field_tag(name, value = nil, options = {})
       result = <<EOS
     <script type="text/javascript">
        // <![CDATA[
        jQuery(function () {
            jQuery('.typeahead').typeahead()
        });
        // ]]>
      </script>
      <input id="#{name}" name="#{name}" type="text" data-provide="typeahead" />
      <script>
        jQuery(function() {
        //テキストボックスにカレンダーをバインドする（パラメータは必要に応じて）
        jQuery("##{name}").datepicker({
          firstDay: 1,    //週の先頭を月曜日にする（デフォルトは日曜日）
          dateFormat: 'yy/mm/dd',
          prevText: '<<',
          nextText: '>>',

          //年月をドロップダウンリストから選択できるようにする場合
          changeYear: false,
          changeMonth: false,

         });
       });
      </script>
EOS
    return raw result;

  end

  def getDayOfWeek(date)
    getDayOfWeekDay(date.wday)
  end

  def getDayOfWeekDay(wday)
    arr = ["日","月","火","水","木","金","土"]
    arr[wday]
  end

  # カラム名を受け取ってそれがシステムカラムなのかを返す
  def system_column?(column)
    SysConfig.system_column?(column)
  end

  def getFlgName(flg)
    flg == 0 ? 'なし' : 'あり'
  end

  # text_fieldにTimestamp型の属性を渡すと、DBから帰ってきた文字列をそのまま表示してしまう。
  # その為、内部で保持している属性情報を「DBから帰ってきた文字列」から「Time型」に変換する必要がある。
  # ちなみに、「DBから返ってきた文字列」は、object.method.before_type_castで見ることができる。内部では
  # このmethodを多用しているようだ。
  def time_text_field(object_name, method, options = {})
    if v = self.instance_variable_get("@#{object_name}")
      tmp = self.instance_variable_get("@#{object_name}").send(method) if v.respond_to?(method)
      v.send(method + '=', tmp) if tmp.class == Time
    end
    text_field(object_name, method, options)
  end

  def paginate_far(scope, options = {}, &block)
    paginator = Kaminari::Helpers::Paginator.new self, options.reverse_merge(:current_page => scope.current_page, :total_pages => scope.current_page + 1, :per_page => scope.limit_value, :param_name => Kaminari.config.param_name, :remote => false)
    paginator.to_s
  end

  # put_paginatesで使う関数
  def each_pages(pages, &block)
    st = (pages.current.to_i - 4)
    ed = (st + 10)
    st = st < 1 ? 1 : st
    ed = ed > pages.page_count ? pages.page_count : ed
    (st..ed).each do |x|
      yield x
    end
  end

  # Paginateタグ一式を出力する
  def put_paginates(pages, css_class = 'paginate', total_count = 0)
    "<div class='#{css_class}'>#{put_paginates_span(pages, css_class, total_count)}</div>"
  end

  def put_paginates_prefix(pages, css_class = 'paginate', total_count = 0, urlstr = nil)
    "<div class='#{css_class}'>#{put_paginates_span_prefix(pages, css_class, total_count, urlstr)}</div>"
  end

  def put_paginates_span(pages, css_class = 'paginate', total_count = 0)
    put_paginates_span_prefix(pages, css_class, total_count, request.env['REQUEST_URI'])
  end

  # Paginateタグ一式を出力する
  def put_paginates_span_prefix(pages, css_class, total_count, urlstr) # url_for(:kyoten_cd => ?, :eigyotancd => ?)
    # url_forがroutes.rbの絡みで不思議な踊りを踊るので、自力でURL生成(涙)
    urlstr =~ /\?/
    prefix = $` || urlstr
    suffix = $'.to_s.gsub(/\&*page=\d+/,'')
    prefix = prefix + '?' + (suffix.blank? ? 'page=' : suffix + '&page=')

    first = pages.current.first? ? '<<最新' : link_to('<<最新', prefix + pages.first_page.to_i.to_s)
    prev = pages.current.previous ? link_to('<前', prefix + pages.current.previous.to_i.to_s) : '<前'
    numbers = ""
    each_pages(pages) { |x|
      numbers += ' ' + (pages.current.to_i == x.to_i ? x.to_s : link_to(x, prefix + x.to_s))
    }
    nex = (pages.current.next ? link_to('次>', prefix + pages.current.next.to_i.to_s) : '次>')
    last = pages.current.last? ? '最後>>' : link_to('最後>>', prefix + pages.last_page.to_i.to_s)

    total_count_str = total_count == 0 ? '' : " total: #{total_count}"

    "<span class='paginate_span'>#{first} #{prev} #{numbers} #{nex} #{last} #{total_count_str}</span>"
  end

  def money_format_i(num)
    money_format(num.to_i)
  end

  def money_format(num)
    return (num.to_s =~ /[-+]?\d{4,}/) ? (num.to_s.reverse.gsub(/\G((?:\d+\.)?\d{3})(?=\d)/, '\1,').reverse) : num.to_s
  end

  def link_and_if(condition, name, options = {}, html_options = {}, &block)
    if condition
      link_to(name, options, html_options, &block)
    else
      name
    end
  end

  def link_to_popup_mode(name, options = {}, html_options = {}, &block)
    if @popup_mode
      options[:popup] = 1
    end
    link_to(name, options, html_options, &block)
  end

  def form_tag_popup_mode(url_for_options = {}, options = {}, &block)
    if @popup_mode
      url_for_options[:popup] = 1
    end
    form_tag(url_for_options,options,&block)
  end

  def back_to
    params[:back_to]
  end

  def request_url
    request.env['REQUEST_URI']
  end

  def back_to_link_popup_mode(name, options = {}, html_options = {}, &block)
    if @popup_mode
      options[:popup] = 1
    end
    back_to_link(name, options, html_options, &block)
  end

  def back_to_link(name, options = {}, html_options = {}, &block)
    if options.class == String
      x = if options.include?('?')
        "&"
      else
        "?"
      end
      options += x + "back_to=" + URI.encode(request_url, Regexp.new("[^#{URI::PATTERN::ALNUM}]"))
    elsif options.is_a?(ActiveRecord::Base)
      options = polymorphic_path(options) + "?back_to=" + URI.encode(request_url, Regexp.new("[^#{URI::PATTERN::ALNUM}]"))
    else
      options[:back_to] = request_url
    end
    link_to(name, options, html_options, &block)
  end

  def back_to_link_if(cond, name, options = {}, html_options = {}, &block)
    options[:back_to] = request_url
    link_to_if(cond, name, options, html_options, &block)
  end

  def link_or_back(name, options = {}, html_options = {}, &block)
    if html_options[:class].blank?
      html_options[:class] = "btn btn-default btn-medium"
    end
    link_to(name, (back_to || options), html_options, &block)
  end

  def delete_to(name, object, action = 'destroy', option = {})
    option[:confirm] = 'この情報を削除します。よろしいですか?'
    option[:method] = :post
    option[:class] = "btn btn-default btn-medium" if option[:class].blank?
    link_to(name, { :action => action, :id => object, :back_to => back_to, :authenticity_token => form_authenticity_token }, option)
  end

  def delete_to_rest(name, object, option = {})
    option[:data] = {confirm: 'この情報を削除します。よろしいですか?'}
    option[:method] = :delete
    option[:class] = "btn btn-default btn-medium" if option[:class].blank?
    link_to(name, { :id => object, :back_to => back_to, :authenticity_token => form_authenticity_token }, option)
  end

  def square_table(array, options = {}, tag_options = {}, &block)
    col = (options[:col] || 3).to_i
    tag_option_arr = ['table']
    tag_options[:class] = 'square_table' unless tag_options[:class]
    if tag_options.is_a?(Hash)
      tag_options.each do |key, val|
        tag_option_arr << [key.to_s, "'#{val.to_s}'"].join("=")
      end
    end
    str = ""
    str << "<#{tag_option_arr.join(' ')}>\n"
    array.each_index do |idx|
      if idx % col == 0
        str << '<tr style="text-align: center;">'
        col.times do |j|
          str << '<td>'
          if x = array[idx+j]
            str << capture do block.call(x, idx) end
          end
          str << '</td>'
        end
        str << "</tr>\n"
      end
    end
    str << '</table>'
    raw str
  end

  def popup?
    @popup_mode
  end

  def back_to
    params[:back_to]
  end

  def request_url
    if request.original_url.nil?
      ""
    else
      request.original_url
    end
  end

  def back_to_field_tag
    params[:back_to].blank? ? "" : hidden_field_tag('back_to', params[:back_to])
  end

  def calHourMinuteFormat(sec)
    require 'date_time_util'
    DateTimeUtil.calHourMinuteFormat(sec)
  end

  def star_links(target, title = "")
    icon_opt = { id: StarUtil.attr_id(target),
                 class: StarUtil.attr_class(target),
                 name: StarUtil.attr_name(target),
                 style: StarUtil.attr_style( target.starred ) }

    link_opt = { controller: :home,
                 action: :change_star,
                 id: target.id,
                 model: target.class.name,
                 authenticity_token: form_authenticity_token }

    content_tag(:span, class: "linked_star") do
      link_to( content_tag(:span, "★", icon_opt), link_opt, :title => title)
    end
  end

  def popup_hidden_field
    if popup?
      return hidden_field_tag :popup, params[:popup]
    else
      return ''
    end
  end

  def disp_wide_link(text, url_option, option={})
    url = url_for(url_option)
    option[:onclick] = "disp_wide('#{url}');return false"
    link_to text, "#", option
  end

  def popover(tag_name, text, content, option = {})
    if !option[:rel]
      option[:rel] = ( option[:title] ? "popover" : "popover-without-title" )
    end

    # data-xxxx属性の設定
    option[:data] ||= {}
    data = option[:data]
    data[:html] = (data[:html] || "false")
    data[:trigger] = (data[:trigger] || "hover")
    data[:animation] = (data[:animation] || "false")
    data[:content] = content

    if text
      content_tag(tag_name, text, option)
    else
      tag(tag_name, option)
    end
  end

  def get_background_color
    if ENV['RAILS_ENV'] == 'development'
      style = 'background-image: -moz-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(paleturquoise), to(paleturquoise));'
      style += 'background-image: -webkit-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: -o-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: linear-gradient(to bottom, paleturquoise, paleturquoise);'
    else
      ''
    end
  end

  def accordion_around(title, suffix, hide=false, &block)
    accordion_around_in(1, title, suffix, hide, &block)
  end

  def accordion_around_h2(title, suffix, hide=false, &block)
    accordion_around_in(2, title, suffix, hide, &block)
  end

  def accordion_around_h3(title, suffix, hide=false, &block)
    accordion_around_in(3, title, suffix, hide, &block)
  end

  def accordion_around_in(level, title, suffix, hide, &block)
    res = raw <<EOS
<div class="accordion" id="accordion#{suffix}">
  <div class="accordion-group">
    <div class="accordion-heading">
      <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion#{suffix}" href="#collapseForm#{suffix}"><h#{level}>#{title} <i id="collapseArrow#{suffix}" class="fa fa-arrow-circle-o-down"></i></h#{level}></a>
    </div>
    <div id="collapseForm#{suffix}" class="collapse in">
      <div class="accordion-inner">
        #{capture(&block)}
      </div>
    </div>
  </div>
</div>

<div class="accordion-bottom"></div>
<script type="text/javascript">
<!--
  $(document).ready(function(){
    #{hide ? "$('#collapseForm#{suffix}').collapse('toggle');$('#collapseArrow#{suffix}').animate({rotate: 90});" : "" }
    $('#collapseForm#{suffix}').on('hide.bs.collapse', function(){
      $('#collapseArrow#{suffix}').animate({rotate: 90})
    });
      $('#collapseForm#{suffix}').on('show.bs.collapse', function(){
          $('#collapseArrow#{suffix}').animate({rotate: 0})
      });
  });
-->
</script>
EOS
    res
  end

  def btn_primary(opt={})
    btn_in('primary',opt)
  end

  def btn_info(opt={})
    btn_in('info',opt)
  end

  def btn_warning(opt={})
    btn_in('warning',opt)
  end

  def btn_default(opt={})
    btn_in('default',opt)
  end

  def btn_in(kind, opt)
    if opt[:class].blank?
      opt[:class] = "btn btn-#{kind} btn-md"
    end
    opt
  end

  def show_rate_stars(rate)
    raw("<i class='glyphicon glyphicon-star stars-active'></i>"  * rate + "<i class='glyphicon glyphicon-star stars-inactive'></i>" * (5 - rate))
  end

  def star_radios(starred, model=nil)
    if model
      model_str = model.class.name
      model_id = model.id
    end
    res = [3,4,0,1,2].map do |x|
      <<EOS
      <label class="btn btn-xs btn-default#{starred.to_s == x.to_s ? ' active' : '' }">
        #{radio_button_tag("starred#{model_id}", x.to_s, starred.to_s == x.to_s, :post_url => url_for(:controller => :home, :action => :fix), :model => model_str, :target_id => model_id, :class => "starred_radio") } <span style="#{StarUtil.attr_style(x)}">★</span>
      </label>
EOS
    end
    raw "<div class='btn-group' data-toggle='buttons'>" + res.join + "</div>"
  end

  def get_way_type(import_mail)
    if import_mail.biz_offer_mail?
      'biz_offer'
    elsif import_mail.bp_member_mail?
      'bp_member'
    else
      'other'
    end
  end
end
