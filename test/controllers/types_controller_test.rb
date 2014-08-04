require 'test_helper'

class TypesControllerTest < ActionController::TestCase
  setup do
    @type = types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create type" do
    assert_difference('Type.count') do
      post :create, type: { display_order1: @type.display_order1, display_order2: @type.display_order2, logic_bind_type: @type.logic_bind_type, long_name: @type.long_name, other_name: @type.other_name, short_name: @type.short_name, type_description: @type.type_description, type_description_text: @type.type_description_text, type_key: @type.type_key, type_section: @type.type_section }
    end

    assert_redirected_to type_path(assigns(:type))
  end

  test "should show type" do
    get :show, id: @type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @type
    assert_response :success
  end

  test "should update type" do
    patch :update, id: @type, type: { display_order1: @type.display_order1, display_order2: @type.display_order2, logic_bind_type: @type.logic_bind_type, long_name: @type.long_name, other_name: @type.other_name, short_name: @type.short_name, type_description: @type.type_description, type_description_text: @type.type_description_text, type_key: @type.type_key, type_section: @type.type_section }
    assert_redirected_to type_path(assigns(:type))
  end

  test "should destroy type" do
    assert_difference('Type.count', -1) do
      delete :destroy, id: @type
    end

    assert_redirected_to types_path
  end
end
