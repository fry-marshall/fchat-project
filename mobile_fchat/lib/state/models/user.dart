
class User{
  String? id;
  String? fullname;
  String? description;
  String? email;
  String? profile_img;


  User({
    this.id,
    this.fullname,
    this.description,
    this.email,
    this.profile_img,
  });

  User.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    fullname = json['fullname'];
    description = json['description'];
    email = json['email'];
    profile_img = json['profile_img'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['fullname'] = fullname;
    data['description'] = description;
    data['email'] = email;
    data['profile_img'] = profile_img;
    return data;
  }
}